"use server";

import { revalidatePath } from "next/cache";

import { checkSupabaseEnv, createPublicClient } from "@/lib/supabase/server";

export async function recordShownPet(imageUrl: string) {
  const env = checkSupabaseEnv();
  if (!env.ok) {
    return { ok: false as const, error: env.message };
  }

  try {
    const supabase = createPublicClient();
    if (!supabase) {
      return { ok: false as const, error: "Could not create Supabase client." };
    }

    const { error } = await supabase.from("shown_pets").insert({ image_url: imageUrl });

    if (error) {
      return { ok: false as const, error: error.message };
    }

    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error saving to database.";
    return { ok: false as const, error: message };
  }
}
