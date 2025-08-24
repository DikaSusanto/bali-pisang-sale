"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import {
  updateLastActivity,
  isIdleTimeoutExceeded,
  clearLastActivity,
} from "@/utils/idleTimeout";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    const updateActivity = () => updateLastActivity();

    activityEvents.forEach((event) =>
      window.addEventListener(event, updateActivity)
    );

    updateLastActivity();

    const interval = setInterval(() => {
      if (isIdleTimeoutExceeded()) {
        clearLastActivity();
        signOut({ callbackUrl: "/login" });
      }
    }, 60 * 1000);

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, updateActivity)
      );
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}