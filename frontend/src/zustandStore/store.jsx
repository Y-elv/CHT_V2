import create from "zustand";
import { persist } from "zustand/middleware";

export const useBadgeStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      profile: null,

      setProfile: (item) => {
        console.log("🟣 [Zustand] setProfile called");
        console.log("🟣 [Zustand] Profile data:", item);
        console.log("🟣 [Zustand] Profile email:", item?.email);
        console.log("🟣 [Zustand] Profile role:", item?.role);
        console.log("🟣 [Zustand] Profile name:", item?.name);
        console.log("🟣 [Zustand] Profile token exists:", !!item?.token);
        set(() => ({ profile: item }));
        console.log("🟣 [Zustand] setProfile completed");
      },
      setIsLoggedIn: (item) => {
        console.log("🟣 [Zustand] setIsLoggedIn called");
        console.log("🟣 [Zustand] isLoggedIn value:", item);
        set(() => ({ isLoggedIn: item }));
        console.log("🟣 [Zustand] setIsLoggedIn completed");
      },
      clearProfile: () => {
        console.log("🟣 [Zustand] clearProfile called");
        set(() => ({ profile: null }));
        console.log("🟣 [Zustand] clearProfile completed");
      },
    }),
    {
      name: "badge-store", // Name of the item in localStorage
      getStorage: () => localStorage, // (Optional) Define which storage to use
      serialize: (state) => JSON.stringify(state), // (Optional) Serialization function
      deserialize: (str) => JSON.parse(str), // (Optional) Deserialization function
    }
  )
);
