import CreateExpense from "@/components/CreateExpense";
import DeleteWallet from "@/components/DeleteWallet";
import ExpenseTable from "@/components/ExpenseTable";
import Navbar from "@/components/Navbar";
import DeleteExpense from "@/components/DeleteExpense";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Icons } from "@/components/Icons";

const Wallet = async ({ params }: { params: { walletId: string } }) => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const wallet = await api.wallet.getById({
    walletId: params.walletId,
  });

  const expenses = await api.expense.getAll({
    walletId: params.walletId,
  });

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      <Navbar user={session.user} />
      <Suspense fallback={<Icons.loading className="animate-spin" />}>
        <div className="flex items-center justify-between p-8 text-lime-500">
          <div className="flex items-center gap-x-4">
            <h1 className="text-4xl font-bold italic">{wallet.name}</h1>
            <DeleteWallet walletId={params.walletId} />
            <CreateExpense walletId={params.walletId} />
          </div>
          <div className="flex items-center gap-x-12">
            <DeleteExpense />
            <h1 className="text-4xl italic">{wallet.balance}</h1>
          </div>
        </div>
        <ExpenseTable expenses={expenses} />
      </Suspense>
    </div>
  );
};

export default Wallet;
