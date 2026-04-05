import { PetPipeline } from "./components/pet-pipeline";
import { getShownPets } from "@/lib/shown-pets";

export default async function Home() {
  const { pets, configured, loadError } = await getShownPets();

  return (
    <div className="min-h-full flex-1 bg-zinc-50 px-4 py-10 font-sans sm:px-6 lg:px-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center lg:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-700 dark:text-amber-500">
            Pet Hotel ERP
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pipeline check
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-zinc-600 lg:mx-0 dark:text-zinc-400">
            Load dogs on the left; each image is stored in Supabase. Click any row on the right to show that dog on the
            left.
          </p>
        </header>

        <PetPipeline pets={pets} configured={configured} loadError={loadError} />
      </div>
    </div>
  );
}
