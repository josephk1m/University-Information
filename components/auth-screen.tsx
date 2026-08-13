"use client";

import {
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "signin" | "signup";

function friendlyError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "The email or password is incorrect.";
  }
  if (message.toLowerCase().includes("already registered")) {
    return "An account already exists for this email.";
  }
  if (message.toLowerCase().includes("database error")) {
    return "That username may already be in use. Please choose another.";
  }
  return message;
}

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setIsError(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const displayName = String(form.get("displayName") ?? "").trim();
    const username = String(form.get("username") ?? "").trim().toLowerCase();

    setBusy(true);
    setMessage("");
    setIsError(false);

    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(friendlyError(error.message));
        setIsError(true);
        setBusy(false);
        return;
      }
      window.location.assign("/");
      return;
    }

    if (!/^[a-z0-9_]{3,24}$/.test(username)) {
      setMessage("Username must be 3–24 characters using letters, numbers, or underscores.");
      setIsError(true);
      setBusy(false);
      return;
    }

    if (displayName.length < 2 || displayName.length > 50) {
      setMessage("Name must be between 2 and 50 characters.");
      setIsError(true);
      setBusy(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(friendlyError(error.message));
      setIsError(true);
      setBusy(false);
      return;
    }

    if (data.session) {
      window.location.assign("/");
      return;
    }

    setMessage("Account created. Check your email to confirm it, then sign in.");
    setBusy(false);
    event.currentTarget.reset();
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel" aria-label="MechMate introduction">
        <div className="auth-brand">
          <span className="brand-mark"><Wrench size={20} /></span>
          <span>MECH<span>MATE</span></span>
        </div>
        <div className="auth-pitch">
          <p className="eyebrow">First-year engineering, organized</p>
          <h1>Keep every deadline, lab, and material in one place.</h1>
          <p>Built for mechanical engineering students who need a clear plan—not another complicated portal.</p>
        </div>
        <div className="auth-assurance">
          <ShieldCheck size={20} />
          <span><strong>Your profile stays consistent.</strong> Your registered name, username, and email are fixed for this account.</span>
        </div>
      </section>

      <section className="auth-form-panel" aria-labelledby="auth-title">
        <div className="auth-mobile-brand">
          <span className="brand-mark"><Wrench size={18} /></span>
          <strong>MECH<span>MATE</span></strong>
        </div>
        <div className="auth-form-card">
          <p className="eyebrow">Secure student access</p>
          <h2 id="auth-title">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
          <p>{mode === "signin" ? "Sign in with your registered email." : "Choose your identity carefully—it cannot be edited later."}</p>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "active" : ""} onClick={() => switchMode("signin")}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === "signup" && (
              <>
                <label>
                  Full name
                  <span><UserRound size={17} /><input name="displayName" autoComplete="name" required minLength={2} maxLength={50} placeholder="Joseph Kim" /></span>
                </label>
                <label>
                  Username
                  <span><AtSign size={17} /><input name="username" autoComplete="username" required minLength={3} maxLength={24} pattern="[a-zA-Z0-9_]+" placeholder="joseph_kim" /></span>
                  <small>Letters, numbers, and underscores only.</small>
                </label>
              </>
            )}
            <label>
              Email address
              <span><Mail size={17} /><input name="email" type="email" autoComplete="email" required placeholder="student@university.edu" /></span>
            </label>
            <label>
              Password
              <span><LockKeyhole size={17} /><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={8} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            </label>

            {message && <div className={isError ? "auth-message error" : "auth-message success"} role="status">{message}</div>}

            <button className="auth-submit" type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-footnote">To use another email account, sign out first and then sign in again.</p>
        </div>
      </section>
    </main>
  );
}
