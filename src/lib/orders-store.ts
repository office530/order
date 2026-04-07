import "server-only";
import type { Location, PackageId } from "./types";

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

interface OrdersStore {
  create(input: CreateOrderInput): Promise<CreatedOrder>;
}

/* ────────────── In-memory backend (dev fallback) ────────────── */

type MemBag = { orders: Map<string, CreateOrderInput & CreatedOrder> };
const g = globalThis as unknown as { __ordersMem?: MemBag };
const mem: MemBag = g.__ordersMem ?? { orders: new Map() };
g.__ordersMem = mem;

function uuid(): string {
  // crypto.randomUUID is available on Node 19+; fallback just in case
  return (
    globalThis.crypto?.randomUUID?.() ??
    "mem-" + Math.random().toString(36).slice(2) + Date.now().toString(36)
  );
}

const memoryStore: OrdersStore = {
  async create(input) {
    const id = uuid();
    const createdAt = Date.now();
    mem.orders.set(id, { ...input, id, createdAt });
    return { id, createdAt };
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

    // Upsert customer by phone
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
};

export function getOrdersStore(): OrdersStore {
  return supabaseEnabled() ? supabaseStore : memoryStore;
}
