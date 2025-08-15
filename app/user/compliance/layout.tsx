"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ThemeProvider } from "@/components/theme-provider";
import "../../globals.css";


export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    async function checkAuth() {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) {
          setError("Gagal memeriksa autentikasi.");
          setAuthenticated(false);
          return;
        }
        if (!session || !session.user) {
          router.replace("/user");
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } catch (e) {
        setError("Terjadi kesalahan jaringan atau server.");
        setAuthenticated(false);
      }
    }
    checkAuth();
    // Timeout jika lebih dari 7 detik
    timeoutId = setTimeout(() => {
      if (authenticated === null) {
        setError("Timeout: Autentikasi terlalu lama.");
        setAuthenticated(false);
      }
    }, 7000);
    return () => clearTimeout(timeoutId);
  }, [router, supabase]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <span className="text-lg font-semibold text-red-500">{error}</span>
        <button className="mt-4 px-4 py-2 bg-muted rounded" onClick={() => window.location.reload()}>Coba Lagi</button>
      </div>
    );
  }
  if (authenticated === false) {
    return null;
  }
  if (authenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Checking authentication...</div>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="antialiased min-h-screen bg-gradient-to-b from-background to-muted/30">
        {children}
      </div>
    </ThemeProvider>
  );
}
