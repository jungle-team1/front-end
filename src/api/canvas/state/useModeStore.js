import { create } from "zustand";

const useModeStore = create((set) => ({
    // isPainting: false,
    isErase: false,
    isRectangle: false,
    isCircle: false,

    // setIsPainting: (isPainting) => set({ isPainting }),
    setIsErase: (isErase) => set({ isErase }),
    setIsRectangle: (isRectangle) => set({ isRectangle }),
    setIsCircle: (isCircle) => set({ isCircle })
}));

export default useModeStore;
