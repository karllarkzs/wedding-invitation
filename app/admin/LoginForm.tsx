"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });

  return (
    <div className="paper-card relative mx-auto mt-10 max-w-sm px-7 py-9">
      <div className="hairline-inset rounded-[20px]" />
      <form action={action} className="relative">
        <label htmlFor="admin-password" className="block text-[0.78rem] font-semibold uppercase tracking-[0.2em]">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="field mt-2"
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "admin-error" : undefined}
        />
        {!configured && (
          <p className="mt-3 text-[0.95rem] text-ink-soft">
            Set <code className="rounded bg-ivory px-1">ADMIN_PASSWORD</code> in your environment to enable this page.
          </p>
        )}
        {state.error && (
          <p id="admin-error" role="alert" className="mt-3 text-[0.98rem] text-wax">
            {state.error}
          </p>
        )}
        <button type="submit" className="btn btn-primary mt-6 w-full" disabled={pending}>
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
