"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { loginSchema } from "@/lib/utils/validation";
import { loginAdmin, requestPasswordReset } from "@/actions/auth";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetNotice, setResetNotice] = useState("");
  const [resetting, setResetting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values) {
    setError("");
    const res = await loginAdmin(values);
    if (res?.error) {
      setError(res.error);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setResetting(true);
    setResetNotice("");
    const res = await requestPasswordReset(resetEmail);
    setResetting(false);
    setResetNotice(res.message);
  }

  return (
    <div className="min-h-screen bg-cream bg-warm-grain flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-surface border border-brown/12 p-8 sm:p-10 shadow-[var(--shadow-elevated)] space-y-7">
        <div className="flex flex-col items-center text-center space-y-3">
          <BrandLogo />
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            <Lock className="h-3 w-3" />
            Admin Portal
          </div>
          <h1 className="font-display text-3xl font-semibold text-brown">
            {resetMode ? "Password Recovery" : "Administrator Sign In"}
          </h1>
        </div>

        {!resetMode ? (
          <>
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-terracotta/40 bg-terracotta/10 p-3.5 text-xs text-brown">
                <AlertCircle className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@thethirdplace.lk"
                  {...register("email")}
                  className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown focus:border-primary focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-terracotta">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetMode(true);
                      setError("");
                    }}
                    className="font-sans text-xs text-primary hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown focus:border-primary focus:outline-none"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-terracotta">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {resetNotice && (
              <div className="flex items-start gap-2.5 rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-xs text-primary">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{resetNotice}</p>
              </div>
            )}
            <div>
              <label
                htmlFor="reset-email"
                className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-brown/80 mb-1.5"
              >
                Administrator Email
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@thethirdplace.lk"
                className="w-full rounded-xl border border-brown/20 bg-cream px-4 py-3 font-sans text-sm text-brown focus:border-primary focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={resetting}
              className="w-full"
            >
              {resetting ? "Sending..." : "Send Recovery Link"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setResetMode(false);
                setResetNotice("");
              }}
              className="w-full text-center font-sans text-xs text-brown/75 hover:text-primary cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-brown/12 text-center">
          <Link
            href="/"
            className="font-sans text-xs font-medium text-primary hover:underline"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
