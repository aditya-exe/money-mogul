"use client";

import { Button } from "./ui/button";
import { Icons } from "./Icons";
import { api } from "@/trpc/react";
import { zustand } from "@/lib/zustand";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteExpense = () => {
  const router = useRouter();
  const { expenseIds } = zustand();
  const { mutate, isPending } = api.expense.deleteByIds.useMutation({
    onSuccess: () => {
      toast("Expense deleted successfully");
    },
    onSettled: () => {
      router.refresh();
    },
  });

  function handleDelete() {
    mutate({
      expenseIds,
    });
  }

  return (
    <Button
      onClick={handleDelete}
      variant={"destructive"}
      size={"sm"}
      className="flex items-center gap-x-4 text-white"
      disabled={expenseIds.length === 0}
    >
      {isPending ? <Icons.loading className="animate-spin" /> : null}
      <Icons.delete />
    </Button>
  );
};

export default DeleteExpense;
