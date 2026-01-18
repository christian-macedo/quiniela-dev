/**
 * Calculate points for a prediction based on actual match result
 *
 * Scoring rules:
 * - Exact score: 10 points
 * - Correct winner and goal difference: 7 points
 * - Correct winner: 5 points
 * - Incorrect: 0 points
 */
export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  // Exact score match
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return 10;
  }

  const predictedDiff = predictedHome - predictedAway;
  const actualDiff = actualHome - actualAway;

  // Correct winner and goal difference
  if (
    Math.sign(predictedDiff) === Math.sign(actualDiff) &&
    Math.abs(predictedDiff) === Math.abs(actualDiff)
  ) {
    return 7;
  }

  // Correct winner (including draws)
  if (Math.sign(predictedDiff) === Math.sign(actualDiff)) {
    return 5;
  }

  // Incorrect prediction
  return 0;
}

/**
 * Get a description of how the points were calculated
 */
export function getPointsDescription(points: number): string {
  switch (points) {
    case 10:
      return "Exact score!";
    case 7:
      return "Correct winner and goal difference";
    case 5:
      return "Correct winner";
    default:
      return "No points";
  }
}
