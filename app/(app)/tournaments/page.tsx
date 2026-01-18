import { createClient } from "@/lib/supabase/server";
import { TournamentList } from "@/components/tournaments/tournament-list";
import { redirect } from "next/navigation";

export default async function TournamentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tournaments</h1>
        <p className="text-muted-foreground">
          Select a tournament to view matches and make predictions
        </p>
      </div>
      <TournamentList tournaments={tournaments || []} />
    </div>
  );
}
