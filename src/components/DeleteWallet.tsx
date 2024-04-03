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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icons } from "./Icons";

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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="p-2">
          <Icons.options className="rounded-full text-xl hover:ring-2 hover:ring-lime-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <p className="cursor-pointer select-none px-4 py-2 font-bold text-white hover:text-red-500">
              Delete Wallet
            </p>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeleteWallet;
