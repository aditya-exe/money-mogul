"use client";

import type { FC } from "react";
import { Button, buttonVariants } from "./ui/button";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface IDeleteWallet {
  walletId: string;
}

const DeleteWallet: FC<IDeleteWallet> = ({ walletId }) => {
  const router = useRouter();
  const { mutate } = api.wallet.deleteById.useMutation({
    onSettled: () => {
      toast("Wallet Deleted");
      router.replace("/dashboard");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"destructive"}
          size={"sm"}
          className="hover:bg-gray-700 hover:text-white hover:ring-2 hover:ring-red-600"
        >
          Delete Wallet
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => {
              mutate({
                walletId,
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWallet;
