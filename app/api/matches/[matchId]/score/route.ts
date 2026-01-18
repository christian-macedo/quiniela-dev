import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { calculatePoints } from "@/lib/utils/scoring";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const supabase = await createClient();
    const { matchId } = await params;
    const body = await request.json();
    const { home_score, away_score } = body;

    // Update match score
    const { error: matchError } = await supabase
      .from("matches")
      .update({
        home_score,
        away_score,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", matchId);

    if (matchError) throw matchError;

    // Get all predictions for this match
    const { data: predictions, error: predictionsError } = await supabase
      .from("predictions")
      .select("*")
      .eq("match_id", matchId);

    if (predictionsError) throw predictionsError;

    // Calculate and update points for each prediction
    for (const prediction of predictions || []) {
      const points = calculatePoints(
        prediction.predicted_home_score,
        prediction.predicted_away_score,
        home_score,
        away_score
      );

      await supabase
        .from("predictions")
        .update({ points_earned: points })
        .eq("id", prediction.id);
    }

    // Update tournament rankings
    const { data: match } = await supabase
      .from("matches")
      .select("tournament_id")
      .eq("id", matchId)
      .single();

    if (match) {
      await updateTournamentRankings(supabase, match.tournament_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating match score:", error);
    return NextResponse.json(
      { error: "Failed to update match score" },
      { status: 500 }
    );
  }
}

async function updateTournamentRankings(supabase: SupabaseClient, tournamentId: string) {
  // Get all predictions for this tournament
  const { data: predictions } = await supabase
    .from("predictions")
    .select("user_id, points_earned, match:matches!inner(tournament_id)")
    .eq("match.tournament_id", tournamentId);

  // Calculate total points per user
  const userPoints = new Map<string, number>();
  predictions?.forEach((p: { user_id: string; points_earned: number }) => {
    const current = userPoints.get(p.user_id) || 0;
    userPoints.set(p.user_id, current + p.points_earned);
  });

  // Update or insert rankings
  for (const [userId, totalPoints] of userPoints.entries()) {
    await supabase
      .from("tournament_rankings")
      .upsert({
        user_id: userId,
        tournament_id: tournamentId,
        total_points: totalPoints,
        updated_at: new Date().toISOString(),
      });
  }

  // Update ranks
  const { data: rankings } = await supabase
    .from("tournament_rankings")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("total_points", { ascending: false });

  rankings?.forEach(async (ranking: { user_id: string }, index: number) => {
    await supabase
      .from("tournament_rankings")
      .update({ rank: index + 1 })
      .eq("user_id", ranking.user_id)
      .eq("tournament_id", tournamentId);
  });
}
