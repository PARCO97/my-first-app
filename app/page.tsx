import { RandomDog } from "./components/random-dog";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-lg flex-col items-center gap-10 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-700 dark:text-amber-500">
            Pet Hotel ERP
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pipeline check
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Click the button—each request loads a new random dog from the public{" "}
            <span className="whitespace-nowrap">Dog CEO</span> API.
          </p>
        </div>
        <RandomDog />
      </main>
    </div>
  );
}
