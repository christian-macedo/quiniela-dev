import { Tournament } from "@/types/database";
import { TournamentCard } from "./tournament-card";

interface TournamentListProps {
  tournaments: Tournament[];
}

export function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tournaments available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
