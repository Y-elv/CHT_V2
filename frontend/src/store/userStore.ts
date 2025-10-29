// store/userStore.ts
import { create } from "zustand";
import { User } from "../types/admin";

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setUsers: (users: User[]) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  setUsers: (users) => set({ users }),

  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),

  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}));
