"use client";

import { create } from "zustand";
import type { Location, PackageId } from "@/lib/types";

interface OrderDraft {
  phone: string | null;
  packageId: PackageId | null;
  areaSqm: number | null;
  location: Location | null;
  floor: number | null;
  contactName: string | null;
  contactEmail: string | null;
}

interface OrderStore extends OrderDraft {
  setPhone: (phone: string) => void;
  setPackage: (id: PackageId) => void;
  setConfigure: (data: {
    areaSqm: number;
    location: Location;
    floor: number | null;
    contactName: string;
    contactEmail: string;
  }) => void;
  reset: () => void;
}

const EMPTY: OrderDraft = {
  phone: null,
  packageId: null,
  areaSqm: null,
  location: null,
  floor: null,
  contactName: null,
  contactEmail: null,
};

/**
 * State גלובלי של ההזמנה הנוכחית בזרימה.
 * נשמר לזיכרון בלבד — לא מתמיד בין רענונים בכוונה (למניעת דליפת PII).
 */
export const useOrder = create<OrderStore>((set) => ({
  ...EMPTY,
  setPhone: (phone) => set({ phone }),
  setPackage: (packageId) => set({ packageId }),
  setConfigure: (data) =>
    set({
      areaSqm: data.areaSqm,
      location: data.location,
      floor: data.floor,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
    }),
  reset: () => set(EMPTY),
}));
