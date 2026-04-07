export type PackageId = "essential" | "classic" | "premium" | "signature";

export type Location =
  | "center"
  | "sharon"
  | "north"
  | "south"
  | "jerusalem"
  | "haifa";

export type OrderStatus =
  | "pending"
  | "paid"
  | "contract_sent"
  | "contract_signed"
  | "meeting_scheduled"
  | "active"
  | "cancelled"
  | "refunded";

export interface PackageFeatures {
  design: string;
  materials: string;
  lighting: string;
  partition: string;
  systems: string;
  warranty: string;
  management: string;
}

export interface Package {
  id: PackageId;
  name: string;
  name_he: string;
  price_per_sqm: number;
  features: PackageFeatures;
  sort_order: number;
}

export interface Customer {
  id: string;
  phone: string;
  name: string | null;
  company: string | null;
  email: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  package_id: PackageId;
  area_sqm: number;
  location: Location;
  floor: number | null;
  estimated_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
  payment_id: string | null;
  contract_signed: boolean;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OtpSession {
  id: string;
  phone: string;
  code: string;
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
}
