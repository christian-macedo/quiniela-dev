import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/tournaments" className="text-2xl font-bold">
            Quiniela
          </Link>
          <div className="flex gap-4">
            <Link href="/tournaments">
              <Button variant="ghost">Tournaments</Button>
            </Link>
            {user && (
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
