import Image from "next/image";

import type { ShownPetRow } from "@/lib/shown-pets";

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ShownPetsList({
  pets,
  configured,
  loadError,
}: {
  pets: ShownPetRow[];
  configured: boolean;
  loadError: string | null;
}) {
  if (!configured) {
    return (
      <aside className="flex h-full min-h-[280px] flex-col rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-5 dark:border-zinc-600 dark:bg-zinc-900/80">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Pets from database</h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Set <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          in <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">.env.local</code> (and on
          Vercel) to load this list from Supabase.
        </p>
      </aside>
    );
  }

  if (loadError) {
    return (
      <aside className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
        <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">Could not load pets</h2>
        <p className="mt-2 text-sm text-red-800 dark:text-red-300">{loadError}</p>
      </aside>
    );
  }

  return (
    <aside className="flex max-h-[min(70vh,640px)] flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Pets shown (Supabase)</h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Newest first · {pets.length} {pets.length === 1 ? "entry" : "entries"}
        </p>
      </div>
      {pets.length === 0 ? (
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No rows yet. Load a dog on the left—each one is saved here.
        </p>
      ) : (
        <ul className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {pets.map((pet) => (
            <li
              key={pet.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-2 dark:border-zinc-800 dark:bg-zinc-950/50"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={pet.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400" title={pet.image_url}>
                  {pet.image_url.replace(/^https:\/\/images\.dog\.ceo\/breeds\//, "").replace(/\/[^/]+$/, "")}
                </p>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{formatWhen(pet.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
