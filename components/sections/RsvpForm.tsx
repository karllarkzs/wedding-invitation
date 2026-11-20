"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WaxSeal } from "@/components/art/WaxSeal";
import { useInvite, type Invite } from "@/components/InviteContext";
import {
  fieldErrorsFrom,
  rsvpSchema,
  type FieldErrors,
  type RsvpField,
  type RsvpResponse,
  type SavedReply,
} from "@/lib/rsvp-schema";

type ReadyInvite = Extract<Invite, { status: "ready" }>;
type YesNo = "" | "yes" | "no";
type Values = {
  attending: YesNo;
  plusOne: YesNo;
  plusOneName: string;
  message: string;
  /** Honeypot — real guests never see or fill this. */
  website: string;
};
type Success = Extract<RsvpResponse, { ok: true }>;

const FIELD_ORDER: RsvpField[] = ["attending", "plusOne", "plusOneName", "message"];
const LABEL = "block font-display text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-ink";
const EASE = [0.22, 1, 0.36, 1] as const;
const HEART = "M12 20.3s-7.3-4.4-7.3-10a4.1 4.1 0 0 1 7.3-2.6 4.1 4.1 0 0 1 7.3 2.6c0 5.6-7.3 10-7.3 10Z";

type Props = { weddingDate: string; contact: string };

/**
 * The RSVP card. Replies come only through personal links (/?i=CODE): the
 * guest's name and whether they may bring a +1 come from the guest list.
 */
export function RsvpForm({ weddingDate, contact }: Props) {
  const { invite, saveReply, retry } = useInvite();

  let body: React.ReactNode;
  switch (invite.status) {
    case "pending":
    case "loading":
      body = (
        <p role="status" className="flex items-center justify-center gap-3 py-10 italic text-ink-soft">
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold-deep" />
          Finding your invitation…
        </p>
      );
      break;
    case "none":
      body = (
        <Notice title="Your personal link">
          <p>We&rsquo;ve sent each of our guests a personal link to reply. Please open the one we sent you; it already knows your name.</p>
          <p className="mt-3 text-[1rem]">Can&rsquo;t find it? {contact}</p>
        </Notice>
      );
      break;
    case "invalid":
      body = (
        <Notice title="We can't find this link">
          <p>Please check you opened the full link we sent you.</p>
          <p className="mt-3 text-[1rem]">Still not working? {contact}</p>
        </Notice>
      );
      break;
    case "error":
      body = (
        <Notice title="Just a moment">
          <p>{invite.message}</p>
          <button type="button" onClick={retry} className="btn btn-outline mt-6">
            Try again
          </button>
        </Notice>
      );
      break;
    case "ready":
      // keyed by code so the form starts from this guest's saved reply
      body = <GuestForm key={invite.code} invite={invite} weddingDate={weddingDate} onSaved={saveReply} />;
      break;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={invite.status === "loading" ? "pending" : invite.status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {body}
      </motion.div>
    </AnimatePresence>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 text-center">
      <WaxSeal className="mx-auto size-16 drop-shadow-[0_8px_10px_rgba(74,24,33,0.3)]" />
      <h3 className="mt-5 font-script text-[2.5rem] leading-tight text-ink">{title}</h3>
      <div className="mx-auto mt-3 max-w-sm text-[1.12rem] leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          className="mt-2 flex items-start gap-1.5 text-[0.98rem] leading-snug text-wax"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <svg viewBox="0 0 16 16" className="mt-[3px] size-3.5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm-.75 3.25h1.5v4.5h-1.5v-4.5Zm0 5.75h1.5V12h-1.5v-1.5Z" />
          </svg>
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** Two large tappable answer cards, e.g. "Joyfully accepts" / "Regretfully declines". */
function Choice({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  className = "",
}: {
  name: RsvpField;
  legend: string;
  options: readonly { value: "yes" | "no"; label: string; icon: string }[];
  value: YesNo;
  onChange: (v: "yes" | "no") => void;
  error?: string;
  className?: string;
}) {
  return (
    <fieldset className={className} aria-describedby={error ? `rsvp-${name}-error` : undefined}>
      <legend className={LABEL}>{legend}</legend>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const checked = value === opt.value;
          return (
            <label key={opt.value} className="relative flex cursor-pointer">
              <input
                id={i === 0 ? `rsvp-${name}` : undefined}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="peer sr-only"
              />
              <span
                className={`flex min-h-[6.25rem] w-full flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4 text-center transition-all duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-deep ${
                  checked
                    ? opt.value === "yes"
                      ? "bg-candle-soft text-ink shadow-[inset_0_0_0_1.5px_var(--color-gold-deep),0_10px_22px_-14px_rgba(132,105,62,0.7)]"
                      : "bg-pearl text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink-soft),0_10px_22px_-14px_rgba(70,63,82,0.5)]"
                    : error
                      ? "bg-white text-ink-soft shadow-[inset_0_0_0_1.5px_var(--color-wax)]"
                      : "bg-white text-ink-soft shadow-[inset_0_0_0_1px_rgba(180,152,103,0.5)] hover:bg-ivory"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`size-6 transition-colors ${checked ? (opt.value === "yes" ? "text-wax" : "text-ink") : "text-gold"}`}
                  fill={checked && opt.value === "yes" ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={opt.icon} />
                </svg>
                <span className="text-[1.08rem] font-semibold leading-tight">{opt.label}</span>
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={`rsvp-${name}-error`} message={error} />
    </fieldset>
  );
}

const ATTENDING = [
  { value: "yes", label: "Joyfully accepts", icon: HEART },
  { value: "no", label: "Regretfully declines", icon: "M5.5 12h13" },
] as const;

const PLUS_ONE = [
  // two hearts / one heart
  { value: "yes", label: "Yes, with my +1", icon: "M9 19s-5.5-3.3-5.5-7.5a3.1 3.1 0 0 1 5.5-2 3.1 3.1 0 0 1 5.5 2M15 20.5s-5-3-5-6.8a2.8 2.8 0 0 1 5-1.8 2.8 2.8 0 0 1 5 1.8c0 3.8-5 6.8-5 6.8Z" },
  { value: "no", label: "Just me", icon: HEART },
] as const;

function initialValues(reply: SavedReply | null): Values {
  if (!reply) return { attending: "", plusOne: "", plusOneName: "", message: "", website: "" };
  return {
    attending: reply.attending,
    plusOne: reply.attending === "yes" ? (reply.plusOneName ? "yes" : "no") : "",
    plusOneName: reply.plusOneName,
    message: reply.message,
    website: "",
  };
}

function GuestForm({
  invite,
  weddingDate,
  onSaved,
}: {
  invite: ReadyInvite;
  weddingDate: string;
  onSaved: (reply: SavedReply) => void;
}) {
  const [values, setValues] = useState<Values>(() => initialValues(invite.reply));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Success | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const askPlusOne = invite.plusOne && values.attending === "yes";

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (fe: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => fe[f]);
    if (first) document.getElementById(`rsvp-${first}`)?.focus();
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setFormError(null);

    const parsed = rsvpSchema.safeParse({
      code: invite.code,
      attending: values.attending,
      plusOne: askPlusOne ? values.plusOne || undefined : "no",
      plusOneName: values.plusOneName,
      message: values.message,
    });
    const fe = parsed.success ? {} : fieldErrorsFrom(parsed.error);
    if (askPlusOne && !values.plusOne) fe.plusOne = "Please let us know if you're bringing a +1.";
    if (!parsed.success || Object.keys(fe).length) {
      setErrors(fe);
      focusFirstError(fe);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: values.website }),
      });
      const data = (await res.json().catch(() => null)) as RsvpResponse | null;
      if (data?.ok) {
        setResult(data);
        onSaved({ attending: data.attending, plusOneName: data.plusOneName, message: parsed.data.message });
        requestAnimationFrame(() => {
          rootRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          thanksRef.current?.focus({ preventScroll: true });
        });
        return;
      }
      if (data && !data.ok && data.fieldErrors && Object.keys(data.fieldErrors).length) {
        setErrors(data.fieldErrors);
        focusFirstError(data.fieldErrors);
      }
      setFormError(
        data && !data.ok ? data.error : "We couldn't send your reply just now. Please try again in a moment.",
      );
    } catch {
      setFormError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Back to the form with their answers kept, so they can change their reply.
  const changeReply = () => {
    setErrors({});
    setResult(null);
    setFormError(null);
  };

  return (
    <div ref={rootRef} className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="thanks"
            className="py-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative mx-auto size-32">
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-wax/30"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: [0.7, 1.8], opacity: [0.7, 0] }}
                transition={{ delay: 0.32, duration: 1.1, ease: "easeOut" }}
              />
              <motion.div
                initial={{ scale: 2.6, opacity: 0, rotate: -26, y: -46 }}
                animate={{ scale: 1, opacity: 1, rotate: -8, y: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 18, mass: 1 }}
              >
                <WaxSeal className="size-32 drop-shadow-[0_10px_12px_rgba(74,24,33,0.35)]" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
              role="status"
            >
              <h3 ref={thanksRef} tabIndex={-1} className="mt-7 text-balance font-script text-[2.9rem] leading-tight text-ink outline-none">
                {result.attending === "yes" ? `Thank you, ${result.name}!` : `We'll miss you, ${result.name}`}
              </h3>
              <p className="mx-auto mt-4 max-w-sm text-[1.15rem] leading-relaxed text-ink-soft">
                {result.attending === "no"
                  ? `Thank you so much for letting us know. You'll be in our hearts on ${weddingDate}, and we'll be sure to share the photos.`
                  : result.plusOneName
                    ? `Your reply is sealed. We've saved seats for you and ${result.plusOneName}, and we can't wait to celebrate with you both on ${weddingDate}.`
                    : `Your reply is sealed. We've saved a seat for you, and we can't wait to celebrate with you on ${weddingDate}.`}
              </p>
              {result.updated && (
                <p className="mt-3 text-[0.95rem] italic text-sage-deep">We&rsquo;ve updated your earlier reply.</p>
              )}
              {result.demo && (
                <p className="mx-auto mt-4 max-w-xs rounded-xl bg-candle-soft px-4 py-2 text-sm text-ink">
                  Preview mode: this reply wasn&rsquo;t saved because Google Sheets isn&rsquo;t connected yet.
                </p>
              )}
              <button
                type="button"
                onClick={changeReply}
                className="link-hairline mt-8 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
              >
                Change my reply
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            aria-describedby={formError ? "rsvp-form-error" : undefined}
          >
            {/* Who this invitation is for */}
            <div className="text-center">
              <p className="eyebrow">Your invitation</p>
              <p className="mt-2 text-balance font-script text-[2.6rem] leading-[1.1] text-ink">{invite.name}</p>
              {invite.plusOne && (
                <p className="mt-2 text-[1.02rem] italic text-ink-soft">You&rsquo;re welcome to bring a +1.</p>
              )}
              {invite.reply && (
                <p className="mx-auto mt-4 max-w-sm rounded-xl bg-candle-soft px-4 py-2.5 text-[1rem] leading-snug text-ink">
                  You&rsquo;ve already replied. You can change your answer below anytime.
                </p>
              )}
            </div>
            <div aria-hidden="true" className="mx-auto mt-6 h-px w-24 bg-gold/40" />

            <Choice
              className="mt-7"
              name="attending"
              legend="Will you be joining us?"
              options={ATTENDING}
              value={values.attending}
              onChange={(v) => set("attending", v)}
              error={errors.attending}
            />

            {/* +1 — only for guests whose invitation includes one, and only when attending */}
            <AnimatePresence initial={false}>
              {askPlusOne && (
                <motion.div
                  key="plus-one"
                  className="overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {/* spacing on a wrapper: padding on a fieldset lands below its legend */}
                  <div className="pt-7">
                    <Choice
                      name="plusOne"
                      legend="Will you bring a +1?"
                      options={PLUS_ONE}
                      value={values.plusOne}
                      onChange={(v) => set("plusOne", v)}
                      error={errors.plusOne}
                    />
                  </div>
                  <AnimatePresence initial={false}>
                    {values.plusOne === "yes" && (
                      <motion.div
                        key="plus-one-name"
                        className="overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <div className="pt-6">
                          <label htmlFor="rsvp-plusOneName" className={LABEL}>
                            Your +1&rsquo;s full name
                          </label>
                          <input
                            id="rsvp-plusOneName"
                            name="plusOneName"
                            type="text"
                            autoComplete="off"
                            autoCapitalize="words"
                            placeholder="Full name"
                            className="field mt-2"
                            value={values.plusOneName}
                            maxLength={80}
                            onChange={(e) => set("plusOneName", e.target.value)}
                            aria-invalid={Boolean(errors.plusOneName)}
                            aria-describedby={errors.plusOneName ? "rsvp-plusOneName-error" : undefined}
                          />
                          <FieldError id="rsvp-plusOneName-error" message={errors.plusOneName} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message */}
            <div className="mt-7">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="rsvp-message" className={LABEL}>
                  A note to the couple{" "}
                  <span className="font-medium normal-case tracking-normal text-ink-soft">(optional)</span>
                </label>
                <span className="text-sm tabular-nums text-ink-soft" aria-hidden="true">
                  {values.message.length}/500
                </span>
              </div>
              <textarea
                id="rsvp-message"
                name="message"
                rows={4}
                maxLength={500}
                placeholder="Wishes, song requests, dietary notes…"
                className="field mt-2 resize-y leading-relaxed"
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "rsvp-message-error" : undefined}
              />
              <FieldError id="rsvp-message-error" message={errors.message} />
            </div>

            {/* Honeypot (spam trap) */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
              <label htmlFor="rsvp-website">Leave this field empty</label>
              <input
                id="rsvp-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </div>

            {formError && (
              <p
                id="rsvp-form-error"
                role="alert"
                className="mt-7 rounded-xl bg-[#fbeef0] px-4 py-3 text-[1rem] leading-snug text-wax shadow-[inset_0_0_0_1px_rgba(123,46,59,0.25)]"
              >
                {formError}
              </p>
            )}

            <button type="submit" className="btn btn-primary mt-8 w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />
                  Sealing your reply…
                </>
              ) : invite.reply ? (
                "Update my reply"
              ) : (
                "Send my reply"
              )}
            </button>
            <p className="mt-3 text-center text-[0.95rem] leading-snug text-ink-soft">
              Plans changed? Just open your link again and update your reply.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
