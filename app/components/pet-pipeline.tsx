"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { recordShownPet } from "@/app/actions/pets";
import type { ShownPetRow } from "@/lib/shown-pets";

type ApiResponse = { message: string; status: string };

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

function breedLabel(url: string) {
  return url.replace(/^https:\/\/images\.dog\.ceo\/breeds\//, "").replace(/\/[^/]+$/, "");
}

type Props = {
  pets: ShownPetRow[];
  configured: boolean;
  loadError: string | null;
};

export function PetPipeline({ pets, configured, loadError }: Props) {
  const router = useRouter();
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRandomDog = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedId(null);
    let dogImageUrl: string;
    try {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as ApiResponse;
      if (data.status !== "success" || !data.message) {
        throw new Error("Unexpected response");
      }
      dogImageUrl = data.message;
      setDisplayUrl(dogImageUrl);
    } catch {
      setError("Could not load a dog photo. Try again.");
      setLoading(false);
      return;
    }

    try {
      const saved = await recordShownPet(dogImageUrl);
      if (!saved.ok) {
        setError(`Loaded image, but database save failed: ${saved.error}`);
      } else {
        router.refresh();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(`Loaded image, but database save failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const selectPet = useCallback((pet: ShownPetRow) => {
    setDisplayUrl(pet.image_url);
    setSelectedId(pet.id);
    setError(null);
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-12">
      <div className="flex flex-col items-center lg:items-start">
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt="Selected dog"
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 448px"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Use the button for a new random dog, or pick one from the list on the right.
              </div>
            )}
          </div>

          {error ? (
            <p className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={loadRandomDog}
            disabled={loading}
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Loading…" : displayUrl ? "Another dog" : "Show me a dog"}
          </button>
        </div>
      </div>

      {!configured ? (
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
      ) : loadError ? (
        <aside className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
          <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">Could not load pets</h2>
          <p className="mt-2 text-sm text-red-800 dark:text-red-300">{loadError}</p>
        </aside>
      ) : (
        <aside className="flex max-h-[min(70vh,640px)] flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Pets shown (Supabase)</h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Click a row to show it on the left · {pets.length} {pets.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          {pets.length === 0 ? (
            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No rows yet. Load a dog on the left—each one is saved here.
            </p>
          ) : (
            <ul className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {pets.map((pet) => {
                const isSelected = pet.id === selectedId;
                return (
                  <li key={pet.id}>
                    <button
                      type="button"
                      onClick={() => selectPet(pet)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors ${
                        isSelected
                          ? "border-amber-400 bg-amber-50 ring-2 ring-amber-400/40 dark:border-amber-600 dark:bg-amber-950/30 dark:ring-amber-600/30"
                          : "border-zinc-100 bg-zinc-50/80 hover:border-zinc-200 hover:bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/80"
                      }`}
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
                          {breedLabel(pet.image_url)}
                        </p>
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          {formatWhen(pet.created_at)}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      )}
    </div>
  );
}
