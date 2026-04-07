"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Location, PackageId } from "@/lib/types";

interface OrderDraft {
  phone: string | null;
  packageId: PackageId | null;
  areaSqm: number | null;
  location: Location | null;
  floor: number | null;
  contactName: string | null;
  contactEmail: string | null;
  companyName: string | null;
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
    companyName: string | null;
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
  companyName: null,
};

/**
 * State of the current order in the funnel.
 *
 * Persisted to sessionStorage so refreshes and back/forward navigation keep
 * the user's place. We use sessionStorage (not localStorage) so the draft
 * lives only for the current tab — closing the tab clears it, which avoids
 * stale PII sitting in browsers and prevents one user's draft leaking to
 * another on shared machines.
 */
export const useOrder = create<OrderStore>()(
  persist(
    (set) => ({
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
          companyName: data.companyName,
        }),
      reset: () => set(EMPTY),
    }),
    {
      name: "rnvt-order-draft",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? createNoopStorage() : window.sessionStorage
      ),
      partialize: (state) => ({
        phone: state.phone,
        packageId: state.packageId,
        areaSqm: state.areaSqm,
        location: state.location,
        floor: state.floor,
        contactName: state.contactName,
        contactEmail: state.contactEmail,
        companyName: state.companyName,
      }),
    }
  )
);

/**
 * Returns true once the persisted state has been read from sessionStorage.
 * Use to avoid running redirects against an empty draft during the
 * brief pre-hydration window.
 *
 * IMPORTANT: zustand's `hasHydrated()` flips to true *before* the read
 * actually completes in some setups, so we always start at `false` and
 * only flip to `true` after `onFinishHydration` fires (or, as a safety
 * net, after a microtask if hydration was already done synchronously).
 */
export function useOrderHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useOrder.persist.onFinishHydration(() => setHydrated(true));
    // If hydration already completed before this effect ran, flip on next tick
    if (useOrder.persist.hasHydrated()) {
      queueMicrotask(() => setHydrated(true));
    }
    return unsub;
  }, []);

  return hydrated;
}

function createNoopStorage(): Storage {
  return {
    length: 0,
    clear() {},
    getItem() {
      return null;
    },
    key() {
      return null;
    },
    removeItem() {},
    setItem() {},
  };
}
