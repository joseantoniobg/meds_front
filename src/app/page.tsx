"use client";

import { useAuth } from "./contexts/auth.context";
import Login from "./login/page";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <h1>Welcome!</h1>
  );
}
