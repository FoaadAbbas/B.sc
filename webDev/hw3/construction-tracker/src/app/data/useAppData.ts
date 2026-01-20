import { useContext } from "react";
import { AppDataContext } from "./AppDataProvider";

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
