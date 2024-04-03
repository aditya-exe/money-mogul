"use client";

import { useState, type FC, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { type Expense } from "@/server/db/schema";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { zustand } from "@/lib/zustand";

interface ITable {
  expenses: Expense[];
}

const ExpenseTable: FC<ITable> = ({ expenses }) => {
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  // const [isCheck, setIsCheck] = useState<string[]>([]);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const { expenseIds, setExpenseIds } = zustand();

  useEffect(() => {
    setExpenseList(expenses);
  }, [expenseList, expenses]);

  function handleSelectAll() {
    setIsCheckAll(!isCheckAll);
    setExpenseIds(expenseList.map((x) => x.id));
    if (isCheckAll) {
      setExpenseIds([]);
    }
  }

  function handleClick(checked: CheckedState, id: string) {
    setExpenseIds([...expenseIds, id]);
    if (!checked) {
      setExpenseIds(expenseIds.filter((item) => item != id));
    }
  }

  return (
    <Table className="dark">
      <TableCaption>List of expenses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="p-2">
            <Checkbox checked={isCheckAll} onClick={handleSelectAll} />
          </TableHead>
          <TableHead>No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenseList.reverse().map((expense, idx) => {
          return (
            <TableRow key={expense.id} className="text-gray-300">
              <TableCell className="p-2">
                <Checkbox
                  id={expense.id}
                  onCheckedChange={(e) => handleClick(e, expense.id)}
                  checked={expenseIds.includes(expense.id)}
                />
              </TableCell>
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
  );
};

export default ExpenseTable;
