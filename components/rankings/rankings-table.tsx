import { RankingWithUser } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RankingsTableProps {
  rankings: RankingWithUser[];
  currentUserId?: string;
}

export function RankingsTable({ rankings, currentUserId }: RankingsTableProps) {
  if (rankings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No rankings available yet.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rankings.map((ranking, index) => {
            const isCurrentUser = ranking.user_id === currentUserId;
            const displayRank = ranking.rank ?? index + 1;

            return (
              <div
                key={ranking.user_id}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isCurrentUser ? "bg-primary/10 border border-primary" : "hover:bg-muted"
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center font-bold">
                  {displayRank <= 3 ? (
                    <span className="text-2xl">
                      {displayRank === 1 && "🥇"}
                      {displayRank === 2 && "🥈"}
                      {displayRank === 3 && "🥉"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{displayRank}</span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={ranking.user.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {ranking.user.screen_name?.[0]?.toUpperCase() ??
                     ranking.user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1">
                  <div className="font-medium">
                    {ranking.user.screen_name ?? ranking.user.email}
                  </div>
                </div>

                {/* Points */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {ranking.total_points} pts
                  </Badge>
                  {isCurrentUser && (
                    <Badge variant="outline">You</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
