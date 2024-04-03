import { create } from "zustand";

interface State {
  expenseIds: string[];
  setExpenseIds: (x: string[]) => void;
}

export const zustand = create<State>((set) => ({
  expenseIds: [],
  setExpenseIds: (x) => set(() => ({ expenseIds: [...x] })),
}));
