import { create } from "zustand";

const useColorStore = create((set) => ({
    color: "black",
    setColor: (newColor) => set({ color: newColor })
}));

export default useColorStore;