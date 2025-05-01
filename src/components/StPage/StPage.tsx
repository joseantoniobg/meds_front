"use client";

import StNavBar from "../Navbar/StNavbar";
import Login from "@/app/login/page";
import { useAuth } from "@/contexts/auth.context";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export default function StPage({ title, children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <StNavBar />
      <div style={{ margin: "20px" }}>
        <h1 style={{ marginBottom: '10px' }}>{title}</h1>
        {title && <hr />}
        {children}
      </div>
    </div>
  );
}