import { getServerAuthSession } from "@/server/auth";
import SignIn from "@/components/SignIn";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 text-lime-500">
      <h1 className="mt-24 text-9xl font-extrabold italic tracking-tighter">
        Money Mogul
      </h1>
      <SignIn />
    </div>
  );
};

export default Home;
