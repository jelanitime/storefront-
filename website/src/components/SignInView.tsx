"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { register, signIn, signOut, useHydrated, useStore } from "@/lib/store";
import { safeNext } from "@/lib/format";
import { toast } from "@/lib/toast";
import { Logo } from "./Logo";
import { PageLoading } from "./Loading";
import { btn, card, input, label } from "./ui";

type Errors = Partial<Record<"name" | "email" | "password" | "form", string>>;

/** Sign in / create account. Pretend accounts for now: saved in this browser, passwords are never stored. */
export function SignInView() {
  const params = useSearchParams();
  const router = useRouter();
  const hydrated = useHydrated();
  const { user } = useStore();
  const [mode, setMode] = useState<"signin" | "register">(params.get("mode") === "register" ? "register" : "signin");
  const [errors, setErrors] = useState<Errors>({});
  const next = safeNext(params.get("next"));

  if (!hydrated) return <PageLoading label="Loading…" />;

  if (user) {
    return (
      <div className="mx-auto max-w-sm py-16 text-center">
        <h1 className="text-2xl font-bold">You&apos;re signed in as {user.name}</h1>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={next} className={btn.primary}>Continue</Link>
          <button type="button" className={btn.secondary} onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const errs: Errors = {};
    if (mode === "register" && !name) errs.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Please enter a valid email, like name@example.com.";
    if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (Object.keys(errs).length) return setErrors(errs);

    if (mode === "register") {
      if (register({ name, email }) === "exists") {
        return setErrors({ form: "An account with this email already exists. Sign in instead." });
      }
      toast(`Welcome to Pop Shop, ${name.split(" ")[0]}!`);
    } else {
      if (signIn(email) === "not-found") {
        return setErrors({ form: "We couldn't find an account with that email. Create one below." });
      }
      toast("Welcome back!");
    }
    router.push(next);
  };

  const err = (k: keyof Errors) =>
    errors[k] ? <p id={`${k}-err`} className="mt-1 text-xs text-sale">{errors[k]}</p> : null;

  return (
    <div className="mx-auto w-full max-w-md py-6">
      <div className="mb-6 text-center">
        <Logo />
        <h1 className="mt-4 text-2xl font-bold">{mode === "signin" ? "Sign in to your account" : "Create an account"}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {mode === "signin" ? "New to Pop Shop? " : "Already have an account? "}
          <button
            type="button"
            className="text-link underline"
            onClick={() => {
              setMode(mode === "signin" ? "register" : "signin");
              setErrors({});
            }}
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>

      <form noValidate onSubmit={onSubmit} className={`${card} flex flex-col gap-4 p-6`}>
        {errors.form && <p role="alert" className="rounded-card bg-sale/10 p-3 text-sm text-sale">{errors.form}</p>}
        {mode === "register" && (
          <div>
            <label htmlFor="name" className={label}>Full name</label>
            <input id="name" name="name" autoComplete="name" className={input} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-err" : undefined} />
            {err("name")}
          </div>
        )}
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className={input} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-err" : undefined} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="password" className={label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={input}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-err" : undefined}
          />
          {err("password")}
        </div>
        <button type="submit" className={`${btn.primary} mt-2 w-full`}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <p className="text-center text-xs text-ink-muted">
          Demo accounts are saved only in this browser. Passwords are checked for length but never stored.
        </p>
      </form>
    </div>
  );
}
