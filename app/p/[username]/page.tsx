"use client";

import React, { useEffect } from "react";
import HomePage from "@/app/page";
import { useApp } from "@/lib/store";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { switchPersona, profile } = useApp();

  useEffect(() => {
    if (params.username && params.username !== profile.username) {
      switchPersona(params.username);
    }
  }, [params.username, profile.username, switchPersona]);

  return <HomePage />;
}

