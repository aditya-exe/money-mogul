import { Icons } from "@/components/Icons";

const Loading = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 text-lime-500">
      <h1 className="mt-24 text-9xl font-extrabold italic tracking-tighter">
        Money Mogul
      </h1>
      <Icons.loading className="h-8 w-8 animate-spin text-lime-500" />
    </div>
  );
};

export default Loading;
