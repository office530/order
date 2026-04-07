import "server-only";
import type { Location, OrderStatus, PackageId } from "./types";

export interface CreateOrderInput {
  phone: string;
  packageId: PackageId;
  areaSqm: number;
  location: Location;
  floor: number | null;
  estimatedPrice: number;
  contactName: string;
  contactEmail: string;
  companyName?: string | null;
}

export interface CreatedOrder {
  id: string;
  createdAt: number;
}

export interface OrderRecord extends CreateOrderInput {
  id: string;
  createdAt: number;
  status: OrderStatus;
  depositPaid: boolean;
  paymentId: string | null;
}

interface OrdersStore {
  create(input: CreateOrderInput): Promise<CreatedOrder>;
  get(orderId: string): Promise<OrderRecord | null>;
  list(): Promise<OrderRecord[]>;
  markPaid(orderId: string, paymentId: string): Promise<void>;
}

/* ────────────── In-memory backend (dev fallback) ────────────── */

type MemBag = { orders: Map<string, OrderRecord> };
const g = globalThis as unknown as { __ordersMem?: MemBag };
const mem: MemBag = g.__ordersMem ?? { orders: new Map() };
g.__ordersMem = mem;

function uuid(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    "mem-" + Math.random().toString(36).slice(2) + Date.now().toString(36)
  );
}

const memoryStore: OrdersStore = {
  async create(input) {
    const id = uuid();
    const createdAt = Date.now();
    const record: OrderRecord = {
      ...input,
      id,
      createdAt,
      status: "pending",
      depositPaid: false,
      paymentId: null,
    };
    mem.orders.set(id, record);
    return { id, createdAt };
  },

  async get(orderId) {
    return mem.orders.get(orderId) ?? null;
  },

  async list() {
    return Array.from(mem.orders.values()).sort((a, b) => b.createdAt - a.createdAt);
  },

  async markPaid(orderId, paymentId) {
    const order = mem.orders.get(orderId);
    if (!order) return;
    order.depositPaid = true;
    order.paymentId = paymentId;
    order.status = "paid";
    mem.orders.set(orderId, order);
  },
};

/* ────────────── Supabase backend ────────────── */

function supabaseEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function supabaseAdmin() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

const supabaseStore: OrdersStore = {
  async create(input) {
    const sb = await supabaseAdmin();

    const { data: customer, error: customerErr } = await sb
      .from("customers")
      .upsert(
        {
          phone: input.phone,
          name: input.contactName,
          email: input.contactEmail,
          company: input.companyName ?? null,
        },
        { onConflict: "phone" }
      )
      .select()
      .single();

    if (customerErr || !customer) {
      throw new Error(`customer upsert failed: ${customerErr?.message}`);
    }

    const { data: order, error: orderErr } = await sb
      .from("orders")
      .insert({
        customer_id: customer.id,
        package_id: input.packageId,
        area_sqm: input.areaSqm,
        location: input.location,
        floor: input.floor,
        estimated_price: input.estimatedPrice,
        deposit_amount: 2000,
      })
      .select()
      .single();

    if (orderErr || !order) {
      throw new Error(`order insert failed: ${orderErr?.message}`);
    }

    return { id: order.id, createdAt: new Date(order.created_at).getTime() };
  },

  async get(orderId) {
    const sb = await supabaseAdmin();
    const { data: order } = await sb
      .from("orders")
      .select("*, customers(phone, name, email, company)")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) return null;

    const customer = order.customers as
      | { phone: string; name: string | null; email: string | null; company: string | null }
      | null;

    return {
      id: order.id,
      createdAt: new Date(order.created_at).getTime(),
      phone: customer?.phone ?? "",
      packageId: order.package_id,
      areaSqm: order.area_sqm,
      location: order.location,
      floor: order.floor,
      estimatedPrice: order.estimated_price,
      contactName: customer?.name ?? "",
      contactEmail: customer?.email ?? "",
      companyName: customer?.company ?? null,
      status: order.status,
      depositPaid: order.deposit_paid,
      paymentId: order.payment_id,
    };
  },

  async list() {
    const sb = await supabaseAdmin();
    const { data } = await sb
      .from("orders")
      .select("*, customers(phone, name, email, company)")
      .order("created_at", { ascending: false })
      .limit(500);

    if (!data) return [];

    return data.map((order) => {
      const customer = order.customers as
        | {
            phone: string;
            name: string | null;
            email: string | null;
            company: string | null;
          }
        | null;
      return {
        id: order.id,
        createdAt: new Date(order.created_at).getTime(),
        phone: customer?.phone ?? "",
        packageId: order.package_id,
        areaSqm: order.area_sqm,
        location: order.location,
        floor: order.floor,
        estimatedPrice: order.estimated_price,
        contactName: customer?.name ?? "",
        contactEmail: customer?.email ?? "",
        companyName: customer?.company ?? null,
        status: order.status,
        depositPaid: order.deposit_paid,
        paymentId: order.payment_id,
      };
    });
  },

  async markPaid(orderId, paymentId) {
    const sb = await supabaseAdmin();
    await sb
      .from("orders")
      .update({
        deposit_paid: true,
        payment_id: paymentId,
        status: "paid",
      })
      .eq("id", orderId);
  },
};

export function getOrdersStore(): OrdersStore {
  return supabaseEnabled() ? supabaseStore : memoryStore;
}
