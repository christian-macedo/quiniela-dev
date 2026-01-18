"use client";

import { Team } from "@/types/database";
import { TeamBadge } from "./team-badge";
import { Button } from "@/components/ui/button";

interface TeamSelectorProps {
  teams: Team[];
  selectedTeamId?: string;
  onSelect: (teamId: string) => void;
}

export function TeamSelector({ teams, selectedTeamId, onSelect }: TeamSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {teams.map((team) => (
        <Button
          key={team.id}
          variant={selectedTeamId === team.id ? "default" : "outline"}
          className="h-auto py-4 justify-start"
          onClick={() => onSelect(team.id)}
        >
          <TeamBadge team={team} size="sm" showName={true} />
        </Button>
      ))}
    </div>
  );
}
