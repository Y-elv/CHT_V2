import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBadgeStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      profile: null,

      setProfile: (item) => set(() => ({ profile: item })),
      setIsLoggedIn: (item) => set(() => ({ isLoggedIn: item })),
      clearProfile: () => set(() => ({ profile: null })),
    }),
    {
      name: "badge-store", // Name of the item in storage (localStorage)
    }
  )
);
