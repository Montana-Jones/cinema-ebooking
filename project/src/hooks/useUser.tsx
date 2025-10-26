// src/hooks/useUser.tsx
import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  role: "admin" | "customer";
}

export const useUser = () => {
  const [user, setUserState] = useState<User | null>({
    id: "68fe74ef3521b4acc7917a61",
    email: "admin@example.com",
    role: "admin",

    // id: "68fe7c373eb0f054b1ea1864",
    // email: "ane@example.com",
    // role: "customer",
  });

  // On first load, check for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData: User = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
        setUserState(userData);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const setUser = (user: User | null, jwt?: string) => {
    if (user && jwt) {
      localStorage.setItem("token", jwt);
    } else {
      localStorage.removeItem("token");
    }
    setUserState(user);
  };

  return { user, setUser };
};
