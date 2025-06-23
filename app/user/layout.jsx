"use client";
import { useState, createContext } from "react";
import { Header, ViewToggle } from "../components";

export const UserContext = createContext();

export default function Layout({ children }) {
  return (
    <>
      <Header />

      {children}
    </>
  );
}
