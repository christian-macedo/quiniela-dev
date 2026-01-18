import { MatchWithTeams } from "@/types/database";
import { MatchCard } from "./match-card";

interface MatchListProps {
  matches: MatchWithTeams[];
}

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No matches scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
