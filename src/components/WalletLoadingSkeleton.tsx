import { Skeleton } from "./ui/skeleton";

const WalletLoadingSkeleton = () => {
  return (
    <div className="flex h-screen flex-col bg-gray-900">
      <div className="grid w-full grid-cols-3 gap-4 p-8">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          return <Skeleton key={i} className="min-h-44 min-w-44" />;
        })}
      </div>
    </div>
  );
};

export default WalletLoadingSkeleton;
