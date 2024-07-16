import { create } from 'zustand'

export const useLaserStore = create((set, get) => ({
    lasers: [],
    setLasers: (lasers) => set({ lasers }),
    lastLineCompleteTime: 0,
    setLastLineCompleteTime: (time) => set({ lastLineCompleteTime: time }),
}));