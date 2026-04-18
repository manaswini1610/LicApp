import { useContext } from "react";
import Context from "../context/context.js";

export function usePolicies() {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("usePolicies must be used inside the app context provider");
  }
  return ctx;
}
