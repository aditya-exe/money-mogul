import CreateExpense from "@/components/CreateExpense";
import DeleteWallet from "@/components/DeleteWallet";
import Navbar from "@/components/Navbar";
import {
  TableCaption,
  TableRow,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

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
      <div className="flex items-center justify-between p-8 text-lime-500">
        <div className="flex items-center gap-x-4">
          <h1 className="text-4xl font-bold italic">{wallet.name}</h1>
          <CreateExpense walletId={params.walletId} />
        </div>
        <div className="flex items-center gap-x-12">
          <DeleteWallet walletId={params.walletId} />
          <h1 className="text-4xl italic">{wallet.balance}</h1>
        </div>
      </div>
      <div>
        <Table>
          <TableCaption>List of expenses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.reverse().map((expense, idx) => {
              return (
                <TableRow key={expense.id} className="text-gray-300">
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium">{expense.name}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell
                    className={cn("font-bold", {
                      "text-red-600": expense.type === "sub",
                      "text-green-600": expense.type === "add",
                    })}
                  >
                    {expense.type.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-right">
                    {expense.date.toString().slice(0, 24)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Wallet;
