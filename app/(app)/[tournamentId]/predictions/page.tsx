"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PredictionForm } from "@/components/predictions/prediction-form";
import { MatchWithTeams, Prediction } from "@/types/database";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PredictionsPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.tournamentId as string;
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Load matches
    const { data: matchesData } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*)
      `)
      .eq("tournament_id", tournamentId)
      .eq("status", "scheduled")
      .order("match_date", { ascending: true });

    // Load user's predictions
    const { data: predictionsData } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .in("match_id", matchesData?.map(m => m.id) || []);

    setMatches(matchesData || []);

    const predictionsMap: Record<string, Prediction> = {};
    predictionsData?.forEach(p => {
      predictionsMap[p.match_id] = p;
    });
    setPredictions(predictionsMap);
    setLoading(false);
  }

  async function handleSubmitPrediction(matchId: string, homeScore: number, awayScore: number) {
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        match_id: matchId,
        predicted_home_score: homeScore,
        predicted_away_score: awayScore,
      }),
    });

    if (response.ok) {
      loadData();
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Make Predictions</h1>
          <p className="text-muted-foreground">
            Submit your score predictions before matches start
          </p>
        </div>
        <Link href={`/${tournamentId}/matches`}>
          <Button variant="outline">Back to Matches</Button>
        </Link>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming matches available for predictions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <PredictionForm
              key={match.id}
              match={match}
              existingPrediction={predictions[match.id]}
              onSubmit={(home, away) => handleSubmitPrediction(match.id, home, away)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
