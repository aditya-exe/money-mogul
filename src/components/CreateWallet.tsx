"use client";

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
import {useRouter} from "next/navigation" 

const CreateWallet = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [balance, setBalance] = useState<number>(100);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate, isPending } = api.wallet.create.useMutation({
    onSuccess: () => {
      toast("Wallet has been created");
      setIsOpen(false);
      router.refresh();
    },
  });

  function handleCreate() {
    mutate({
      name,
      balance,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button className="text-lime-500 hover:ring-2 hover:ring-lime-500">Add Wallet +</Button>
      </DialogTrigger>
      <DialogContent className="dark text-white">
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
