import { getServerAuthSession } from "@/server/auth";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";
import WalletLoadingSkeleton from "@/components/WalletLoadingSkeleton";

export const revalidate = 3600;

const Dashboard = async () => {
  noStore();
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const dbWallets = await api.wallet.getAll();

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      <Navbar user={session.user} />
      <Suspense fallback={<WalletLoadingSkeleton />}>
        {dbWallets.length === 0 ? (
          <div className="flex w-full flex-grow items-center justify-center text-2xl font-bold">
            <p className="text-lime-500">No wallets found</p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-3 gap-4 p-8 text-lime-500">
            {dbWallets.map((wallet) => {
              return (
                <Link
                  href={`wallet/${wallet.id}`}
                  className="flex min-h-44 min-w-44 cursor-pointer items-start justify-between rounded-lg border-2 border-lime-500 p-4 hover:border-white hover:bg-lime-500 hover:text-white"
                  key={wallet.id}
                >
                  <p className="font-bold italic">{wallet.name}</p>
                  <p className="italic">Balance: {wallet.balance}</p>
                </Link>
              );
            })}
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default Dashboard;
