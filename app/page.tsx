import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to tournaments
  if (user) {
    redirect("/tournaments");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold tracking-tight">
          Quiniela
        </h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Tournament prediction platform for the World Cup and beyond
        </p>
        <p className="text-muted-foreground">
          Predict match scores, compete with friends, and climb the leaderboard
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
