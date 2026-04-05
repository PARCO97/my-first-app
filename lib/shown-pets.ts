import { createClient } from "@/lib/supabase/server";

export type ShownPetRow = {
  id: string;
  image_url: string;
  created_at: string;
};

export async function getShownPets(): Promise<{
  pets: ShownPetRow[];
  configured: boolean;
  loadError: string | null;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { pets: [], configured: false, loadError: null };
  }

  const { data, error } = await supabase
    .from("shown_pets")
    .select("id, image_url, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return { pets: [], configured: true, loadError: error.message };
  }

  return {
    pets: (data ?? []) as ShownPetRow[],
    configured: true,
    loadError: null,
  };
}
