import { create } from "zustand";

interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
  setIsMinimized: (value: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isMinimized: false,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
  setIsMinimized: (value: boolean) => set({ isMinimized: value }),
}));
