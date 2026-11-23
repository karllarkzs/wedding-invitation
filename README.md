# Karl & Hannah: Wedding Invitation + RSVP

A mobile-first wedding invitation website with a built-in RSVP system.

- **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, **Framer Motion**
- A "Save the Date" opening: a paper flower blooms behind the card; tap the wax seal (or **Open invitation**) and the petals scatter to reveal the site
- Hero invitation card, live countdown, our story, a **Ten Years of Us** timeline, a prenup gallery, ceremony and reception cards with "Open in Maps" directions, the program, the dress code, the RSVP form and a footer
- **Personal invitation links**: each guest gets their own link with their name on the RSVP, and only guests you allow see a **+1** option
- RSVPs are saved to **Google Sheets**, next to your guest list. A password-protected **/admin** page shows who's coming, who hasn't replied, and each guest's link to copy
- Link previews for Messenger and Viber, an "Add to calendar" file, and a wax-seal app icon
- All artwork (paper flower and petals, sculpted frames, eucalyptus, wax seal, ornaments, icons) is original inline SVG, generated in code
- Typography: **Great Vibes** (script), **Cinzel** (engraved capitals) and **Cormorant Garamond** (body text), via `next/font`

---

## 1. Run it locally

You need **Node.js 20.9 or newer** (`node -v`).

```bash
npm install
cp .env.example .env.local     # then fill it in (see section 4)
npm run dev
```

Open http://localhost:3000. On your phone, open `http://<your-computer's-LAN-IP>:3000` while on the same Wi-Fi.

> **Preview mode:** until the Google Sheets variables are set, you can try personal links locally with four sample guests: http://localhost:3000/?i=DEMO1 (Maria, allowed a +1), http://localhost:3000/?i=DEMO2 (Juan, no +1), http://localhost:3000/?i=DEMO3 (Lola Rosa, family) and http://localhost:3000/?i=DEMO4 (Paolo Reyes, entourage). Replies show the confirmation with a note that they weren't saved. The sample guests never work on the live site.

---

## 2. Change any detail in one place

Everything lives in **`config/wedding.config.ts`**:

| What | Key |
| --- | --- |
| Names and monogram | `couple` |
| Date, timezone, RSVP deadline | `date`, `timezone`, `rsvpDeadline` |
| Entourage (parents, grandmothers, principal and secondary sponsors, best man and maid of honor, groomsmen and bridesmaids, bearers, flower girls, little brides, offertory) | `entourage`. Shown after the Order of the Day: parents and grandmothers first, the rest behind "View the full entourage". Empty roles are hidden. |
| Ceremony and reception (name, address, time, photo) | `ceremony`, `reception` |
| Arrival and parking note | `venueNote` |
| Program (time, title, detail, icon) | `program` |
| Dress code and color swatches | `dressCode` |
| Note on gifts, and the gift QR codes behind "View gift details" | `gifts`. The QR images are in `public/images/gifts/`: clean redraws of the bank QRs (same payment data, no names or numbers printed around them). Guests can save each one to upload in their bank app. Empty `qrCodes` hides the link. |
| Our story paragraphs | `story.paragraphs` |
| **Ten Years of Us** chapters (title, years, text, photo folder) | `journey.chapters` |
| The day your relationship began (used to compute "10 years") | `relationshipStart` |
| Search-engine indexing (off by default) | `site.allowSearchIndexing` |

Times can be written as `"3:00 PM"` or `"15:00"`. The countdown, calendar file, share image and admin page all update from this file.

---

## 3. Add your photos (and optional music)

Put files in `public/`. Nothing breaks if a file is missing: the site shows an embossed-paper placeholder with the location name instead.

| Photo | Path | Tip |
| --- | --- | --- |
| Church | `public/images/venue/church.jpg` | Landscape (4:3 fits the card exactly), about 1600 px wide. Use a lowercase `.jpg`: on the live server `.JPG` counts as a different file. |
| Reception venue | `public/images/venue/chateu.jpg` | Landscape, about 1600 px wide. Wider shots are trimmed at the sides. |
| Couple (oval frame in Our Story) | `public/images/couple.jpg` | Portrait (4:5) |
| **Prenup gallery** | `public/images/prenup/` | Six photos are laid out: `01` in the big arched window, `02`–`06` as prints around it (portrait photos look best). Name them in order (`01.jpg`, `02.jpg`, …); rename to choose which goes where. Add more than six and a "View all" button opens them all. |
| **Prenup teaser** (optional) | `teaser.link` in the config, or `public/videos/prenup-teaser.mp4` | Best: upload the video to YouTube as **Unlisted** (or to Vimeo) and paste the link into `teaser.link`. A video file also works, but keep it small (it's downloaded by every guest who plays it). It stays hidden until one is added (set `teaser.showWhenMissing: true` to show a "coming soon" frame instead). The background song pauses while the teaser plays. |
| **Story photos** (optional) | `public/images/story/<chapter>/` | One folder per chapter: `younger-years`, `getting-to-work`, `exploring-the-world`, `proposal-trip` (set in `journey.chapters` in the config; the last chapter, "Ten years & forever", has no folder and shows words only). Drop photos straight into the chapter's folder and name them in order, oldest first (`01.jpg`, `02.jpg`, …). The first photo gets the big spot, and tapping opens all of them. The years shown on the site come from each chapter's `when` in the config. Chapters with no photos show an embossed plate. |
| Background music (optional) | `public/audio/our-song.mp3` | A small mute/unmute button appears automatically. Music starts only when the guest taps the seal, because browsers block autoplay. |

Next.js resizes and compresses photos automatically, so you can use full-quality exports. Around 2–4 MB each is plenty.

After adding photos on a deployed site, **commit and redeploy**. Photos are part of the build.

---

## 4. Google Sheets setup (RSVP storage)

The site writes RSVPs to a Google Sheet using a **service account**, a robot Google account that only your server knows the key for. The key is never sent to guests' browsers.

### 4.1 Create the spreadsheet
1. Go to https://sheets.new and name it, for example "Wedding RSVPs".
2. Copy the **sheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`1AbC…xyz`**`/edit` (the part in bold).
3. You don't need to add columns. The first time you open /admin, the app creates two tabs:
   - **`Guests`**: your guest list, with columns `Name | Plus One | Plus One Name | Group | Code | Role`. You fill in **Name** (written the way you'd like it to appear, e.g. "Tita Marites" or "Maria Santos"), **Plus One** (Yes or No), **Plus One Name** (if you already know who it is: shown next to the guest's name and pre-filled on the RSVP) and **Group** (Guest, Family or Entourage), from dropdowns. Leave **Code** empty: the app fills it in. **Role** is optional: whatever you write there (e.g. "Principal Sponsors", "Best Man") is shown as a small gold badge under their name in the RSVP section.
   - **Family** and **Entourage** don't need to RSVP: their link shows their name in the RSVP section and tells them their seat is already saved ("You're family…" or "You're part of our entourage…"). They're counted as coming in /admin. Leaving Group empty means a regular guest.
   - **`RSVPs`**: the replies, `Timestamp | Name | Attending | Plus One | Message | Code | Group`. The site fills this in; Plus One holds the +1's name. Pressing **Refresh** in /admin also lists every Family and Entourage invitation here as coming (Attending: Yes), so this tab is the full list of who's attending; the **Group** column labels each row Guest, Family or Entourage. If someone is later moved to Guest or removed, their added row is taken out again on the next Refresh (a guest's own reply is never removed).

### 4.2 Create a Google Cloud project
1. Open https://console.cloud.google.com/.
2. Click the project picker at the top, then **New Project**. Name it something like `wedding-rsvp`, then **Create**.
3. Make sure the new project is selected in the picker.

### 4.3 Enable the Google Sheets API
1. Go to **APIs & Services → Library**.
2. Search for **Google Sheets API**, open it and click **Enable**.

### 4.4 Create the service account and key
1. Go to **IAM & Admin → Service Accounts → + Create service account**.
2. Name it `rsvp-writer`, then **Create and continue**. Skip the optional role and user steps and click **Done**.
3. Click the new service account, open the **Keys** tab, then **Add key → Create new key → JSON → Create**.
4. A `.json` file downloads. **Keep it private and never commit it.** You need two values from it:
   - `client_email` (looks like `rsvp-writer@wedding-rsvp.iam.gserviceaccount.com`)
   - `private_key` (starts with `-----BEGIN PRIVATE KEY-----`)

> If you see "Service account key creation is disabled", your Google Workspace organization blocks keys. Use a personal Gmail account for the Cloud project instead.

### 4.5 Share the sheet with the service account
1. Open your spreadsheet and click **Share**.
2. Paste the service account's `client_email`.
3. Set the role to **Editor**, untick "Notify people", then **Share**.

### 4.6 Set the environment variables locally
Edit `.env.local`:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=rsvp-writer@wedding-rsvp.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv…\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1AbC…xyz
ADMIN_PASSWORD=pick-a-long-private-password
```

Copy `private_key` exactly as it appears in the JSON, including the `\n` sequences, inside double quotes. The app converts the escaped `\n` into real line breaks, and also accepts a key pasted with real line breaks.

Restart `npm run dev`, open /admin, add yourself to the Guests tab, press Refresh, open your personal link, send a test RSVP, and check the sheet.

---

## 5. Admin page

Visit **`/admin`** and sign in with `ADMIN_PASSWORD`.

- Totals at the top: **coming** (people, including family, entourage and +1s), **declined**, **waiting** (no reply yet) and **invited**
- One row per guest: their reply, their +1's name, their note, and when they replied. **Search** (name, +1, note), **filter** (All / Coming / Declined / Waiting) and **sort** by Guest, Reply or Replied
- **Copy link** copies the guest's personal link to paste into Messenger or Viber (on a phone there's also a **Share** button). Links use `NEXT_PUBLIC_SITE_URL` (or the Netlify address), so they point at the live site.
- **Open Google Sheet** opens the spreadsheet. **Refresh** re-reads it, and gives any newly added guest their personal link.

### Sending invitations
1. Add each guest to the **Guests** tab (Name, Plus One: Yes or No, and Group: Guest, Family or Entourage).
2. Open **/admin** and press **Refresh**. Every new guest gets a random 6-character code, like `K7F2QX`. (Codes are only created when you press Refresh, so the link you copy never changes afterwards.)
3. Press **Copy link** next to a guest and send it to them. Their link opens with their name already on the RSVP.

How +1s are enforced: whether a guest may bring a +1 comes only from the Guests tab, checked on the server. Guests without one never see the option, and a reply that tries to add one anyway is refused. Someone who opens the plain site link (without a code) can see the invitation, but the RSVP asks them to use their personal link. To change a guest's +1, change their Plus One cell; their link stays the same. If a link is ever shared by mistake, clear that guest's Code cell and press Refresh to give them a new one (the old link stops working).

The session is an httpOnly, signed cookie scoped to `/admin` and valid for 7 days. Changing `ADMIN_PASSWORD` signs everyone out. Optionally set `ADMIN_SESSION_SECRET` (`openssl rand -base64 32`) to sign sessions with a separate secret. Login attempts are rate-limited.

---

## 6. Deploy to Netlify

1. Push this folder to a **private** GitHub repository.
   `.env.local` is git-ignored. Never commit the JSON key.
2. In Netlify, choose **Add new site → Import an existing project**, pick GitHub and the repository. Netlify detects Next.js; `netlify.toml` already sets the build command (`npm run build`), the publish folder (`.next`) and Node 22.
3. Before the first deploy (or right after it, then redeploy), open **Site configuration → Environment variables** and add these. Keep each variable's scope on **All**, so the server functions can read them, not just the build:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`: paste the key value. Either the one-line version with `\n` or the multi-line version works. Don't include the surrounding quotes.
   - `GOOGLE_SHEET_ID`
   - `ADMIN_PASSWORD`
   - *(optional)* `ADMIN_SESSION_SECRET`
   - `NEXT_PUBLIC_SITE_URL`: your site's address, for example `https://karl-and-hannah.netlify.app` or your custom domain. Used for link previews and for the personal links you copy in /admin. (If empty, Netlify's main address is used.)
4. Deploy.
5. Open the live site's /admin, add yourself in the Guests tab, press Refresh, copy your personal link, send yourself a test RSVP, check the sheet, then delete your row from the RSVPs tab.

Whenever you change environment variables, **redeploy** (Deploys → Trigger deploy → Deploy site) so they take effect. Server errors appear under **Logs → Functions**.

**Vercel instead?** It works the same way: import the repository at https://vercel.com/new, add the same environment variables, and deploy. `NEXT_PUBLIC_SITE_URL` is optional there.

### Link previews on Messenger and Viber
The preview card (names, date, wax seal, eucalyptus) is generated at build time from `app/opengraph-image.tsx`. Messenger and Viber cache previews. If you shared the link before it was final, paste it into the Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/) and click **Scrape Again**.

---

## 7. How spam protection works

- **Server-side validation** with Zod. The browser checks are for convenience only.
- **Honeypot field**: a hidden input that only bots fill in. Those submissions get a fake "success" and are not saved.
- **Rate limiting by IP**: 6 RSVPs per 10 minutes. This is kept in memory, so each server instance counts separately. It stops bursts of spam, not a determined attacker.
- **Personal links**: replies are only accepted with a valid guest code. Codes are random (about 900 million possibilities), and looking them up is rate-limited (40 per 10 minutes per IP), so they can't be guessed. The guest's name and +1 allowance always come from the Guests tab, never from the form.
- **Duplicate handling**: each guest has one row in RSVPs. Replying again from the same link updates that row instead of adding a new one.
- Values are written to the sheet as plain text (`RAW`), so a name like `=HYPERLINK(...)` is never run as a formula.

---

## 8. Troubleshooting

| Message in the server logs (Netlify: Logs → Functions) | Fix |
| --- | --- |
| `The caller does not have permission` | Share the sheet with the service account email as **Editor** (step 4.5). |
| `Requested entity was not found` | `GOOGLE_SHEET_ID` is wrong. Copy only the ID part of the URL. |
| `Google Sheets API has not been used in project…` | Enable the API (step 4.3) and wait a minute. |
| `error:1E08010C:DECODER routines::unsupported` or `invalid_grant` | The private key is malformed. Re-copy `private_key` from the JSON, including the BEGIN and END lines. |
| A photo still shows the placeholder | Check that the file name and extension exactly match the path in `config/wedding.config.ts` (`church.jpg`, not `Church.JPG`), then redeploy. |

---

## 9. Project structure

```
config/wedding.config.ts      ← all wedding details
app/
  page.tsx                    the invitation (checks which photos exist at build time)
  layout.tsx                  fonts, metadata, background
  opengraph-image.tsx         link-preview card (next/og)
  icon.tsx, apple-icon.tsx    wax-seal icons
  calendar.ics/route.ts       "Add to calendar" file
  api/invite/route.ts         looks up a personal link (?i=CODE): the guest's name, +1 allowance and saved reply
  api/rsvp/route.ts           RSVP endpoint (validation, +1 rule, honeypot, rate limit, Sheets)
  admin/                      login, dashboard, server actions
components/
  BloomIntro.tsx              "Save the Date" opening (blooming paper flower)
  InvitationShell.tsx         open state, scroll lock, music
  InviteContext.tsx           reads the personal link and shares the guest with the page
  sections/                   Hero, Countdown, OurStory, Journey, Gallery + Teaser, Venues, Program, DressCode, Rsvp, Footer
  art/                        original SVG artwork (paper flower, petals, cartouche frames, filigree, eucalyptus, wax seal, icons)
  ui/                         Reveal, InkReveal, Unveil, ShimmerTitle, SectionHeading, SmartImage + EmbossedPlaceholder
lib/                          sheets (guest list + replies), invite codes, auth, rate limit, Zod schema, dates, calendar, OG helpers
assets/fonts/                 Great Vibes, Cinzel + Cormorant Garamond (SIL Open Font License) for the share image
netlify.toml                  Netlify build settings (build command, publish folder, Node version)
```

Accessibility: semantic landmarks, labelled fields with inline errors linked by `aria-describedby`, visible focus rings, an opening screen with a labelled **Open invitation** button, keyboard support in the gallery lightbox, and `prefers-reduced-motion` support (animations reduce to simple fades).
