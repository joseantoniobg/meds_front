"use client";

import { Box, Field, FieldLabel, Input } from "@chakra-ui/react";
import StNavBar from "../Navbar/StNavbar";
import Login from "@/app/login/page";
import { useAuth } from "@/contexts/auth.context";
import styles from "./StPage.module.scss";

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
    <div style={{ minHeight: "100vh" }}>
      <StNavBar />
      <div style={{ margin: "20px", marginBottom: "0px" }}>
        <h1 style={{ marginBottom: '10px' }}>{title}</h1>
        {title && <hr />}
        {children}
      </div>
    </div>
  );
}