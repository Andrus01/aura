"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/site/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Sisselogimine ebaõnnestus.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Ühenduse viga.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-ink px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-cream/10 bg-ink-soft p-8"
      >
        <div className="mb-8 flex items-center gap-3">
          <Logo className="h-7 w-auto text-gold" />
          <span className="font-sans text-[0.62rem] uppercase tracking-luxe text-cream/70">
            Aura &amp; Ood · Admin
          </span>
        </div>

        <label className="mb-2 block font-sans text-[0.64rem] uppercase tracking-luxe text-cream/50">
          Parool
        </label>
        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-cream/15 bg-ink px-4 py-3 font-sans text-sm text-cream outline-none transition-colors focus:border-gold"
          placeholder="••••••••"
        />

        {error && (
          <p className="mt-4 rounded-lg border border-amber-glow/40 bg-amber-glow/10 px-4 py-3 font-sans text-sm text-amber-glow">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">
          {loading ? "Sisenen…" : "Logi sisse"}
        </button>
      </form>
    </main>
  );
}
