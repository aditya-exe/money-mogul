"use client";
// TODO invalidation
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api } from "@/trpc/react";
import { Icons } from "./Icons";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

const CreateWallet = () => {
  const utils = api.useUtils();
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<number>(100);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate, isPending } = api.wallet.create.useMutation({
    onSuccess: () => {
      toast("Wallet has been created");
      void utils.wallet.getAll.invalidate();
      setIsOpen(false);
      revalidatePath("/dashboard");
    },
  });

  function handleCreate() {
    mutate({
      name,
      balance,
    });
    // revalidatePath("/dashboard");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button className="text-lime-500 hover:ring-2 hover:ring-lime-500">Add Wallet +</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new wallet</DialogTitle>
          <DialogDescription>
            Enter the details to your new wallet
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              // defaultValue="Pedro Duarte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance" className="text-right">
              Balance
            </Label>
            <Input
              id="balance"
              type="number"
              className="col-span-3"
              value={balance}
              onChange={(e) => setBalance(parseInt(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreate}
            className="flex items-center"
            disabled={isPending}
          >
            {isPending ? <Icons.loading className="h-5 animate-spin" /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWallet;
