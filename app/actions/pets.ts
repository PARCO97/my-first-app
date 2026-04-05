"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function recordShownPet(imageUrl: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Supabase env vars are not set." };
  }

  const { error } = await supabase.from("shown_pets").insert({ image_url: imageUrl });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/");
  return { ok: true as const };
}
