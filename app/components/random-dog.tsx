"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type ApiResponse = { message: string; status: string };

export function RandomDog() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as ApiResponse;
      if (data.status !== "success" || !data.message) {
        throw new Error("Unexpected response");
      }
      setImageUrl(data.message);
    } catch {
      setError("Could not load a dog photo. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Random dog"
            fill
            className="object-cover"
            sizes="(max-width: 448px) 100vw, 448px"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Tap the button to fetch a random dog from the Dog CEO API.
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
        onClick={loadDog}
        disabled={loading}
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Loading…" : imageUrl ? "Another dog" : "Show me a dog"}
      </button>
    </div>
  );
}
