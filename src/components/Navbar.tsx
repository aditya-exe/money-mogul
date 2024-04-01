"use client";

import { type FC } from "react";
import { type User } from "next-auth";
import UserAvatar from "./UserAvatar";
import CreateWallet from "./CreateWallet";
import Link from "next/link";

interface INavbar {
  user: User;
}

const Navbar: FC<INavbar> = ({ user }) => {
  return (
    <div className="flex justify-between bg-gray-700 p-4">
      <div className="flex items-center gap-x-5">
        <Link
          href="/dashboard"
          className="text-3xl font-extrabold italic tracking-tighter text-lime-500"
        >
          Money Mogul
        </Link>
        <CreateWallet />
      </div>
      <UserAvatar userName={user.name ?? ""} userImage={user.image ?? ""} />
    </div>
  );
};

export default Navbar;
