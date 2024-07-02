import { create } from "zustand";

const useModeStore = create((set) => ({
    isPainting: false,
    setIsPainting: (newIsPainting) => set({ isPainting: newIsPainting }),
    isErase: false,
    setIsErase: (newIsErase) => set({ isErase: newIsErase }),
    isRectangle: false,
    setIsRectangle: (newIsRectangle) => set({ isRectangle: newIsRectangle }),
    isCircle: false,
    setIsCircle: (newIsCircle) => set({ isCircle: newIsCircle })
}));

export default useModeStore;