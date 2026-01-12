import create from 'zustand';

const useEventStore = create((set) => ({
  event: null,
  setEvent: (event) => set({ event }),
  clearEvent: () => set({ event: null }),
}));