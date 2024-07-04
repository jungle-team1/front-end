import { create } from "zustand";

const useColorStore = create((set) => ({
    color: "black",
    setColor: (color) => set({ color })
}));

export default useColorStore;