"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { User } from "@/types/database";
import { uploadImage, generateImageFilename } from "@/lib/utils/image";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    setUser(data);
    setLoading(false);
  }

  async function handleUpdate(screenName: string, avatarFile?: File) {
    if (!user) return;

    let avatarUrl = user.avatar_url;

    // Upload avatar if provided
    if (avatarFile) {
      const filename = generateImageFilename(user.id, avatarFile);
      const url = await uploadImage(avatarFile, "user-avatars", filename);
      if (url) {
        avatarUrl = url;
      }
    }

    const { error } = await supabase
      .from("users")
      .update({
        screen_name: screenName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (!error) {
      loadUser();
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>
      <ProfileEditor user={user} onUpdate={handleUpdate} />
    </div>
  );
}
