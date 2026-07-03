"use client";

import { createContext, useContext } from "react";
import type { Profile } from "@/integrations/supabase/types";

export interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);
