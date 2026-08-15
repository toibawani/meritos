"use client";

import React from "react";
import HomePage from "@/app/page";

export default function ProfilePage({ params }: { params: { username: string } }) {
  // In Next.js client component, HomePage renders the profile corresponding to the route/store
  return <HomePage />;
}
