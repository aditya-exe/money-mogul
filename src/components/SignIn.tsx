"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <>
      <Button
        onClick={() => signIn("discord")}
        variant={"link"}
        className="peer mt-12 text-gray-400 hover:font-bold hover:italic hover:text-lime-400"
        size={"lg"}
      >
        Sign In
      </Button>
      <p className="hidden font-bold italic text-lime-400 peer-hover:block">
        To control your funds
      </p>
    </>
  );
};

export default SignIn;
