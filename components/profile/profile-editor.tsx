"use client";

import { useState } from "react";
import { User } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatLocalDate, formatLocalTime } from "@/lib/utils/date";

interface ProfileEditorProps {
  user: User;
  onUpdate: (screenName: string, avatarFile?: File) => Promise<void>;
}

export function ProfileEditor({ user, onUpdate }: ProfileEditorProps) {
  const [screenName, setScreenName] = useState(user.screen_name ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(screenName, avatarFile ?? undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your display name and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview ?? user.avatar_url ?? undefined} />
                <AvatarFallback className="text-2xl">
                  {screenName?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <label htmlFor="avatar" className="cursor-pointer">
                  <div className="text-sm text-primary hover:underline text-center">
                    Change profile picture
                  </div>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground text-center">
                  JPG, PNG or GIF (max 2MB)
                </p>
              </div>
            </div>

            {/* Screen Name */}
            <div className="space-y-2">
              <label htmlFor="screenName" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="screenName"
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                placeholder="Enter your display name"
              />
              <p className="text-xs text-muted-foreground">
                This is how other users will see your name
              </p>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={user.email} disabled className="bg-muted" />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Last Login */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Last Login
              </label>
              <div className="flex items-center gap-2">
                {user.last_login ? (
                  <>
                    <Badge variant="outline">
                      {formatLocalDate(user.last_login)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      at {formatLocalTime(user.last_login)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Never</span>
                )}
              </div>
            </div>

            {/* Account Created */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Member Since
              </label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {formatLocalDate(user.created_at)}
                </Badge>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              User ID
            </label>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {user.id}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
