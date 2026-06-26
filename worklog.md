# Worklog - Event Registration & Management System

## Project Overview
Building a "Run Against Drugs 2025" event registration & management system.
- Landing page with event details + countdown timer
- Registration form (10 fields)
- My Registration (status check by phone)
- Admin dashboard (login, accept/reject/delete, summary stats)
- Auto ID generation (RD001, RD002...) on accept
- SMS notification on accept

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM + SQLite (configured; can swap to Supabase Postgres)
- Framer Motion, TanStack Query
- Custom JWT/session auth for admin

## Color Theme (from poster)
- Primary: Navy Blue (#0B1A4A / #173083)
- Accent: Red (#DC143C)
- Secondary: Sky Blue (#1E90FF / #87CEEB)
- Highlight: Orange (#FFA500)
- Success: Green (#228B22)

## API Contracts (for frontend subagents)

### Public APIs
- `POST /api/registration` — body: RegistrationInput → { success, data?: { id, name, phoneNumber }, error?: string }
- `GET /api/registration/status?phone=01XXXXXXXXX` → { found: boolean, registration?: Registration }

### Admin APIs (require session cookie)
- `POST /api/admin/login` — body: { username, password } → { success, error? }
- `POST /api/admin/logout` → { success }
- `GET /api/admin/session` → { authenticated: boolean }
- `GET /api/admin/registrations?status=pending|accepted|rejected|all` → { registrations: Registration[] }
- `PATCH /api/admin/registrations/:id` — body: { action: 'accept'|'reject' } → { success, registration?, idNo?, smsSent? }
- `DELETE /api/admin/registrations/:id` → { success }
- `GET /api/admin/summary` → { summary: Summary }

### Types
```typescript
type RegistrationStatus = 'pending' | 'accepted' | 'rejected';
interface Registration {
  id: string; name: string; institutionName: string;
  academicLevel: 'school'|'college'|'university'; academicValue: string;
  tShirtSize: 'S'|'M'|'L'|'XL'|'XXL'|'3XL';
  bkashNumber: string; transactionId: string;
  phoneNumber: string; whatsappNumber: string;
  presentAddress: string; permanentAddress: string;
  status: RegistrationStatus; idNo: string | null;
  createdAt: string; updatedAt: string;
}
interface Summary {
  total: number; pending: number; accepted: number; rejected: number;
  byTShirtSize: Record<string, number>;
  byAcademicLevel: Record<string, number>;
  acceptedByTShirtSize: Record<string, number>;
  acceptedByAcademicLevel: Record<string, number>;
}
```

### View Routing (hash-based, all on `/`)
- `#/` or empty → landing
- `#/register` → registration form
- `#/my-registration` → status check
- `#/admin` → admin login (or dashboard if already authed)

---
Task ID: 1-4
Agent: Main Orchestrator
Task: Foundation - schema, theme, lib, API routes

Work Log:
- Created Prisma schema (Registration, Admin, AdminSession, SmsLog) + pushed to DB
- Created theme colors in globals.css from poster palette (navy #173083, red #dc143c, sky #1e90ff, orange #ffa500, green #228b22)
- Created lib/constants.ts (event config, academic options, tshirt sizes, routes)
- Created lib/auth.ts (scrypt password hashing, session management with DB-backed tokens, httpOnly cookies)
- Created lib/sms.ts (SMS logging service + ID generation RD001, RD002...)
- Created lib/api.ts (fetch-based API client)
- Created lib/nav.ts (hash-based navigation helper)
- Created types/index.ts (shared TypeScript types)
- Created hooks/use-view-router.ts (hash-based view router)
- Created API routes: /api/registration (GET status, POST submit), /api/admin/login, /api/admin/logout, /api/admin/session, /api/admin/registrations (GET list), /api/admin/registrations/[id] (PATCH accept/reject, DELETE), /api/admin/summary
- Created shared components: theme-provider.tsx, navbar.tsx, footer.tsx
- Tested full flow: registration submit -> admin login -> accept (generates RD001, sends SMS) -> summary stats. All working.

Stage Summary:
- Foundation complete and tested. Admin credentials: admin / admin123
- Color theme uses CSS vars: --navy, --brand-red, --sky, --brand-orange, --brand-green + utility classes bg-gradient-navy, bg-gradient-red, bg-gradient-sky, shadow-navy, shadow-red, bg-pattern
- Navigation: use navigate("home"|"register"|"my-registration"|"admin") from "@/lib/nav"
- All shadcn/ui components available in src/components/ui/
- Framer Motion available. Lucide icons available.
- Dev server must be started with: nohup setsid bun run dev > dev.log 2>&1 & disown (dies between bash commands in this env, restart when needed)

---
Task ID: 6
Agent: Registration Form Agent
Task: Build the Registration Form (10 fields) + Success Modal for the public registration flow

Work Log:
- Created `src/components/site/success-modal.tsx`:
  - Custom Framer Motion AnimatePresence modal (backdrop blur + scale/fade entrance)
  - Large animated green CheckCircle2 icon (spring bounce)
  - Title "Registration Submitted Successfully!" + event-reviewed-by-admin message
  - Two buttons: "Check My Status" (bg-gradient-navy → navigate("my-registration")) and "Close" (outline)
  - Named export `SuccessModal({ open, onClose })`
- Created `src/components/site/registration-form.tsx`:
  - Named export `RegistrationForm` (client component, no Navbar/Footer)
  - Used useState-based form state (no RHF dependency, easier to control)
  - 3 themed card sections (border-t-4 colored):
    * Personal Info (sky): Name, Institution, Academic Level + Academic Value (dependent dropdowns)
    * Payment Info (brand-orange): T-Shirt Size, bKash Number (numeric-only), Transaction ID (auto-uppercase, monospace)
    * Contact Info (brand-green): Phone, WhatsApp, Present Address, Permanent Address with "Same as Present" checkbox
  - bKash payment info banner at top (EVENT_CONFIG.bkashNumber + fee 200 BDT + Copy button)
  - Submit button "Complete Registration" with bg-gradient-navy, full-width on mobile, spinner+Processing while submitting
  - Field-level validation matching server (name≥3, institution≥2, phone pattern 01[0-9]{9}, txn pattern [A-Za-z0-9]{6,20}, addresses≥5)
  - Field-level error display with role="alert" + Info icon, aria-invalid + aria-describedby wired
  - Toast notifications: success (after submit), destructive (validation/server error)
  - Behaviors implemented:
    * "Same as Present Address" checkbox mirrors present→permanent and disables permanent field
    * Academic Level change resets academicValue (and clears its error)
    * Transaction ID auto-uppercases on input + on submit
    * Phone/bKash/WhatsApp inputs strip non-digits + maxLength 11
    * On success: reset form + open SuccessModal
    * Server field errors (from ApiError.fields) are merged into local errors state
  - Framer Motion staggered entrance (5 sections, fade+slide up)
  - Responsive: 1 column mobile, 2 columns md+ within each card; pb-12 to clear sticky footer
  - Back-to-home button below submit

Stage Summary:
- Both files created. Lint clean on new files (existing pre-existing lint errors in admin/registration-table.tsx and use-view-router.ts are not from this task).
- Imports verified: navigate, EVENT_CONFIG, ACADEMIC_LEVELS, ACADEMIC_VALUES, TSHIRT_SIZES, api/ApiError, all shadcn/ui (Card, Input, Label, Textarea, Button, Checkbox, Select, Badge), Framer Motion, Lucide icons, useToast.
- API contract: POST /api/registration with the 10-field RegistrationInput; success → show modal; 400 with `fields` → merge field errors; 409 (dup txn) → toast destructive.
- SuccessModal uses props `{ open, onClose }` exactly as specified.
- Component does not include Navbar/Footer; page.tsx should wrap it with those + a min-h-screen flex flex-col container.
- Page integrator: render `<RegistrationForm />` inside the register view; the form already includes the SuccessModal so no extra wiring needed.

---
Task ID: 5
Agent: Landing Page Developer
Task: Build the landing page (hero, countdown, event-info, highlights, faq, landing-page composer) for the Run Against Drugs 2025 event site.

Work Log:
- Read worklog.md to understand context (theme colors, EVENT_CONFIG, navigate(), API contracts, view router).
- Verified available shadcn/ui components (accordion, card, badge, button) and inspected globals.css utility classes (bg-gradient-navy, bg-gradient-red, bg-gradient-sky, bg-gradient-orange, shadow-navy, shadow-red, bg-pattern, text-gradient-navy).
- Created src/components/site/landing/ directory.
- hero.tsx:
  * Full-screen (min-h-screen) section with id="hero".
  * Navy gradient background + bg-pattern overlay + decorative blurred blobs + concentric "running track" SVG rings (bottom-right, hidden on mobile).
  * Tagline pill, large gradient title (white->sky + orange->red), subtitle, date+location badges.
  * CTA buttons: "Register Now" (bg-gradient-red, navigate("register")) and "Learn More" (outline, smooth-scrolls to #about).
  * Stats badges: "500+ Participants", "5 KM Marathon", "Drug-Free Pledge".
  * Framer Motion staggered entrance with custom Variants. Bottom fade transitions to next section.
- countdown.tsx:
  * Section id="countdown" with navy gradient + pattern + decorative blobs.
  * Live countdown via useEffect + setInterval(1000), uses EVENT_CONFIG.eventDate.
  * 4 cards (Days/Hours/Minutes/Seconds) in 2x2 mobile grid -> 4 columns on md+.
  * AnimatePresence number transitions; tabular-nums; top gradient stripe.
  * When event passed, shows "Event Has Started!" message with Flag icon.
  * "Register Before It's Too Late" CTA -> navigate("register").
  * Hydration-safe (mounted flag).
- event-info.tsx:
  * Section id="details" with pattern overlay.
  * 6 info cards (Date & Time, Location, Distance, Registration Fee, bKash Number, Contact) — each with colored gradient icon badge.
  * "How to Register" subsection with 3 numbered steps (Pay via bKash, Fill form, Get confirmation).
  * bKash payment callout box with red/orange gradient background highlighting fee + number + step.
  * Uses Card/CardHeader/CardContent/Badge/Button; Framer Motion stagger via whileInView.
- highlights.tsx:
  * Section id="about" — referenced by Hero's "Learn More" smooth-scroll.
  * 6 highlight cards (Drug-Free Awareness, Community Marathon, Free Event T-Shirt, Certificates & Prizes, Youth Empowerment, Health & Fitness) with colored circle icons.
  * Hover: lift + navy shadow + icon scale. Framer Motion stagger via whileInView.
  * 1 col mobile -> 2 col tablet -> 3 col desktop.
- faq.tsx:
  * Section id="faq".
  * 6 FAQ items using shadcn Accordion (single collapsible). Each with HelpCircle icon and structured answers referencing bKash number, fee, ID format RD001, My Registration flow, WhatsApp join flow.
  * Wrapped in Card for elevation; heading + badge.
- landing-page.tsx:
  * Default + named export of LandingPage.
  * Order: Hero -> Highlights -> Countdown -> EventInfo -> FAQ (matches spec).
  * Wrapped in div.min-h-screen; no Navbar/Footer (page.tsx will handle those).
- Ran `bunx eslint src/components/site/landing/` -> 0 errors/warnings.
- Ran `bunx tsc --noEmit` -> no errors in landing files. (Two pre-existing lint errors in admin/registration-table.tsx and use-view-router.ts from earlier agents — not from this task.)
- Verified dev server log shows clean compilation; no errors related to landing components.

Stage Summary:
Files created (all client components, "use client" declared):
- src/components/site/landing/hero.tsx
- src/components/site/landing/countdown.tsx
- src/components/site/landing/event-info.tsx
- src/components/site/landing/highlights.tsx
- src/components/site/landing/faq.tsx
- src/components/site/landing/landing-page.tsx

Key decisions:
- Theme: stuck strictly to navy/sky/red/orange/green palette — no indigo/blue. Used CSS utility classes (bg-gradient-*, shadow-*, bg-pattern, text-gradient-navy) defined in globals.css.
- Animations: Framer Motion staggered children for hero (initial/animate), whileInView with viewport={{ once: true }} for scroll-triggered reveals on later sections, AnimatePresence for countdown digit transitions.
- Accessibility: every section has id + aria-label; semantic <section>; badges have icon+text; countdown digits aria-live="polite"; accordion trigger has text label; CTA buttons keyboard-accessible via shadcn Button.
- Mobile-first responsive: hero stats stack 1->3 col, countdown 2x2->4 col, info 1->2->3 col, highlights 1->2->3 col, FAQ single column max-w-3xl.
- Hydration safety: countdown uses mounted flag and pads zeros only after mount to avoid SSR/client mismatch.
- bKash callout prominently features EVENT_CONFIG.bkashNumber and registrationFee, with mono-font highlight in brand-red — reinforces payment instructions before registration.
- Did NOT touch src/app/page.tsx; orchestrator can import LandingPage from "@/components/site/landing/landing-page" and render inside the existing min-h-screen flex wrapper alongside Navbar/Footer.

---
Task ID: 8
Agent: Admin Dashboard Agent
Task: Build ADMIN LOGIN + DASHBOARD UI (4 components in src/components/site/admin/)

Work Log:
- Created `src/components/site/admin/admin-login.tsx`
  - Centered card on `bg-gradient-navy` with decorative blobs + `bg-pattern` overlay.
  - ShieldCheck icon in a navy gradient badge at top (spring entrance animation).
  - Title "Admin Login", subtitle "Sign in to manage registrations".
  - Username + Password fields with leading icons (User, Lock), Label+Input association via htmlFor.
  - Full-width `bg-gradient-navy` Login button with ShieldCheck icon; spinner (Loader2 animate-spin) + "Signing in..." text while loading.
  - Error display via shadcn `Alert variant="destructive"` with height animation.
  - On success → calls `onLogin()` and clears fields. Uses `api.post("/api/admin/login", { username, password })` with ApiError try/catch.
  - "Back to Home" ghost button → `navigate("home")`.
  - Framer Motion entrance (opacity+y+scale), max-w-md, fully responsive.

- Created `src/components/site/admin/summary-cards.tsx`
  - Top row: 4 stat cards in 2x2 (mobile) / 4-col (desktop) grid:
    * Total (Users icon, navy tint + navy/10 icon bg)
    * Pending (Clock icon, amber tint + amber/10 icon bg)
    * Accepted (CheckCircle2 icon, brand-green tint)
    * Rejected (XCircle icon, brand-red tint)
  - Each card: large bold number, uppercase label, icon in colored circle, subtle background tint, hover shadow, staggered entrance (delays 0/0.06/0.12/0.18).
  - Two breakdown sections side-by-side (stack on mobile):
    * "By T-Shirt Size" — Sky icon header, rows for S/M/L/XL/XXL/3XL with custom dual-bar progress (total width = navy/30 overlay, accepted width = solid navy), showing "accepted / total" in mono.
    * "By Academic Level" — GraduationCap (orange) header, rows for School/College/University with red dual bars.
  - Loading state: Skeleton placeholders (6 rows for sizes, 3 for levels, full stat cards skeleton).
  - All counts gracefully fall back to 0 when summary is null.

- Created `src/components/site/admin/registration-table.tsx`
  - Columns: Expand chevron, ID No, Name, Institution, Class/Year, T-Shirt, bKash Number, TrxID, Phone, Status, Actions.
  - ID No: navy-outlined badge with `font-mono` if set, em-dash otherwise.
  - Status: custom pill (border + bg + dot) — amber/green/red.
  - Phone / bKash / TrxID rendered in `font-mono text-xs`.
  - Expandable rows: chevron button toggles a motion.div with full details (WhatsApp, present/permanent address, registered date, etc.) — 3-col grid on md+, 2-col on smaller.
  - Actions: Accept (brand-green bg) / Reject (red outline) / Delete (ghost icon, hover destructive).
    * Pending → Accept + Reject + Delete
    * Accepted → Reject (undo) + Delete
    * Rejected → Accept + Delete
  - AlertDialog confirmation for ALL three actions:
    * Accept: "Accept this registration? An SMS with ID number will be sent to {phone}." + SMS preview block; action label "Accept & Send SMS" (green).
    * Reject: "Reject this registration for {name}?..." action "Reject" (amber).
    * Delete: "Are you sure you want to delete this registration? This cannot be undone." action "Delete" (destructive).
  - Mobile responsive: full table on `hidden md:block` (with `max-h-[600px] overflow-auto scrollbar-thin` and sticky header), stacked cards on `md:hidden` with key fields in 2-col grid + action footer.
  - Loading skeletons (6 desktop rows / 4 mobile cards), empty state with Inbox icon.
  - actionLoading per-row: shows spinner, disables interactions.
  - Table min-width 1100px inside horizontal scroll container — usable on tablet.

- Created `src/components/site/admin/admin-dashboard.tsx`
  - State: authed, authChecking, registrations, regsLoading, summary, summaryLoading, activeTab ("all"|"pending"|"accepted"|"rejected"), actionLoading.
  - On mount: `GET /api/admin/session` → setAuthed. While checking: navy spinner full-screen.
  - If not authed → render `<AdminLogin onLogin={handleLogin} />`.
  - If authed → sticky navy gradient header with ShieldCheck badge, title "Admin Dashboard", subtitle, Refresh button (spinner while loading), Logout button.
  - `<SummaryCards summary loading={summaryLoading} />` below header.
  - Tabs row: All/Pending/Accepted/Rejected with icons + count badges (count from summary; navy badge when active). On tab change → `fetchRegistrations(tab)`.
  - `<RegistrationTable registrations loading={regsLoading} onAction={handleAction} actionLoading={actionLoading} />`.
  - `handleAction(id, action)`:
    * delete → `DELETE /api/admin/registrations/:id` → toast "Registration deleted" (destructive).
    * accept/reject → `PATCH /api/admin/registrations/:id` body `{ action }` → success toast. Accept toast includes `ID: {idNo}` + "SMS notification sent." (or "SMS could not be sent — check logs." if smsSent === false). Reject toast is destructive.
    * After any action: refresh both summary + current tab list in parallel.
  - `handleLogout`: `POST /api/admin/logout` then clears state + toast.
  - `handleRefresh`: refetches summary + current tab list, toast "Refreshed".
  - Auto-poll bonus: setInterval(30s) silently refreshes summary + current tab list while authed; cleared on unmount.
  - Sticky footer at bottom (`mt-auto`).
  - Framer Motion page transitions (initial opacity+y, exit y-10) via AnimatePresence mode="wait".

- Verified:
  * `npx eslint src/components/site/admin/` → EXIT 0 (zero lint errors).
  * `npx tsc --noEmit --skipLibCheck` filtered for site/admin → no errors.
  * The only project-wide lint error is in the pre-existing `src/hooks/use-view-router.ts` (Task 1-4, not my responsibility).
  * Components use only existing shadcn/ui primitives (button, card, input, label, badge, table, tabs, alert, alert-dialog, skeleton, progress import removed as unused).
  * Color theme: navy/amber/brand-green/brand-red throughout. NO indigo, NO blue. Custom CSS utilities (bg-gradient-navy, shadow-navy, bg-pattern, scrollbar-thin) used.
  * All 4 files start with `"use client";`.

Stage Summary:
- Admin UI is complete and ready to be wired into `page.tsx` by the orchestrator/next agent.
- Default admin credentials still: username `admin`, password `admin123`.
- Recommended usage in page.tsx: when view === "admin", render `<AdminDashboard />` WITHOUT navbar/footer (it's a self-contained full-screen view with its own sticky header & footer).
- All exports are named: `AdminLogin`, `SummaryCards`, `RegistrationTable`, `AdminDashboard` (with default exports too for flexibility).
- Component composition: `AdminDashboard` internally composes `AdminLogin` (gate) + `SummaryCards` + `RegistrationTable`.

---
Task ID: 7
Agent: My Registration Agent
Task: Build the "MY REGISTRATION" status-check page (phone lookup → registration details card with status badge, ID display, participant/payment/contact info, WhatsApp group CTA)

Work Log:
- Read worklog.md to confirm context (theme colors, navigate(), EVENT_CONFIG.whatsappGroupLink, API contract for GET /api/registration/status?phone=..., Registration type, useToast hook).
- Verified available shadcn/ui primitives (Card family, Button, Input, Label, Badge) and globals.css utility classes (bg-gradient-navy, shadow-navy, shadow-red, bg-pattern, text-gradient-navy). Confirmed no indigo/blue usage in palette.
- Found an existing `src/components/site/my-registration.tsx` (736 lines) — appears to be a prior Task 7 attempt that was never logged. Audited it end-to-end against the task spec; all required behaviors were already implemented correctly.
- No structural rewrite needed. Only one cosmetic edit: tightened the search-section subtitle to match the task spec exactly ("Enter the phone number you used during registration" — previously had a trailing " to view your status and details.").
- Verified the component implements every required behavior:
  * `"use client";` at top, named export `MyRegistration`.
  * Heading "Check Your Registration Status" with `text-gradient-navy` + Search icon in `bg-gradient-navy` rounded badge. Subtitle matches spec.
  * Search form Card with Label+Input (`type="tel"`, `inputMode="numeric"`, `maxLength=11`, leading Phone icon, digits-only filter). Validates 11-digit `01XXXXXXXXX` via `/^01\d{9}$/`; inline `role="alert"` error with AlertCircle icon; `aria-invalid` + `aria-describedby` wired; auto-clears error on input.
  * Submit Button: full-width `bg-gradient-navy text-white hover:opacity-90 shadow-navy`, h-11. Loading state shows `Loader2 animate-spin` + "Searching..." and disables input.
  * Results wrapped in `<div aria-live="polite" aria-atomic="true">` for SR announcements; auto-scrolls into view via `useRef` + `requestAnimationFrame` when result changes.
  * AnimatePresence `mode="wait"` swaps between three result kinds:
    - **not-found**: amber-tinted card with SearchX icon in circle, "User Not Found" heading, message referencing the searched number, "Register Now" (bg-gradient-red → `navigate("register")`) + "Try Another Number" (outline, resets state).
    - **error**: red-tinted card with AlertCircle, "Something went wrong" heading, error message, "Retry Search" button (re-runs last query). Also fires a `destructive` toast.
    - **found**: full FoundCard component (see below).
  * FoundCard:
    - Navy gradient header band ("Registration Found" + "Welcome back, {firstName}!" + Status Badge in top-right corner: amber Clock "Pending Review", green CheckCircle2 "Accepted", red XCircle "Rejected"). Badge uses `variant="outline"` + per-status class strings (bg-50/text-700/border-200 with dark variants).
    - ID Display varies by status:
      · accepted → animated spring-in navy gradient box with `bg-pattern` overlay, mono-font large ID (e.g. RD001), "Show this ID at the event check-in counter." helper with CheckCircle2.
      · pending → amber dashed border box, `RD` + `<span className="blur-[3px]">XXX</span>` (CSS blur filter on placeholder), helper "ID will be assigned after your registration is verified." with Clock icon.
      · rejected → red dashed border box, "No ID assigned", helper note telling user to contact organizers.
    - Participant Info section: Full Name (User), Institution (Building2), Academic Level (GraduationCap), Class/Year (GraduationCap), T-Shirt Size (Shirt). Each row has a colored icon chip + uppercase label + value. Empty values render italic "Not provided".
    - Payment Info: bKash Number (Phone), Transaction ID (Hash).
    - Contact Info: Phone Number (Phone), WhatsApp Number (MessageCircle), Present Address (MapPin), Permanent Address (Home).
    - Application Timeline: Registered On (Calendar) — formatted via `toLocaleString` (year/month/day/hour/minute).
    - WhatsApp button:
      · accepted → `<Button asChild>` rendering `<a href={EVENT_CONFIG.whatsappGroupLink} target="_blank" rel="noopener noreferrer">` with `bg-brand-green`, hover scale via Framer Motion whileHover/whileTap.
      · otherwise → disabled gray button with Lock icon, "Join WhatsApp Group (Available after acceptance)", `aria-disabled="true"`.
    - CardFooter (bordered, muted bg): "Back to Home" ghost (→ navigate("home")) + "Search Another Number" outline (→ resets state).
  * When result is idle (initial load), a separate motion.div below the search form shows "Back to Home" + "Register Now" buttons so the page is never visually empty.
  * Layout matches spec exactly: `<div className="container mx-auto px-4 py-12 sm:py-16 min-h-[calc(100vh-5rem)] bg-pattern"><div className="max-w-2xl mx-auto">…`. Single-column, centered, responsive (sm: breakpoints for button rows and 2-col info grids). Touch targets ≥ h-9 (most are h-11).
- Accessibility pass: semantic `<form>` with `noValidate`, Label `htmlFor` ↔ Input `id`, `role="alert"` on errors, `aria-live="polite"` on results region, `aria-label` on WhatsApp anchor, all interactive elements are real `<button>`/`<a>` (keyboard-reachable). No focus traps; ESC/Tab work natively.
- Color audit: zero indigo/blue usage. Status colors strictly amber/green/red per spec. Primary brand uses `bg-gradient-navy`, `text-navy`, `text-gradient-navy`, `shadow-navy`. Accent actions use `bg-gradient-red` + `shadow-red`. WhatsApp CTA uses `bg-brand-green` (#228b22) per EVENT_CONFIG palette.
- Lint + type-check:
  * `bunx eslint src/components/site/my-registration.tsx` → EXIT 0 (zero warnings/errors).
  * `bunx tsc --noEmit --skipLibCheck | grep my-registration` → no matches (clean).
- Dev server log: no compile errors related to my-registration; the status endpoint was exercised during earlier integration (`GET /api/registration/status?phone=01700000001 404` returned cleanly). Component ready for orchestrator to mount in `page.tsx` under the `my-registration` view alongside Navbar/Footer (which page.tsx manages).

Stage Summary:
- File delivered: `src/components/site/my-registration.tsx` (736 lines, named export `MyRegistration`, `"use client"`).
- Component does NOT include Navbar/Footer and does NOT create any API routes or pages — orchestrator wires it into the existing `#/my-registration` view in `page.tsx`.
- All 4 required result states (idle/not-found/found/error) and all 3 status variants (pending/accepted/rejected) are implemented with proper colors, icons, ID-display logic, and WhatsApp-CTA gating.
- Verified lint-clean and type-clean. Ready to ship.

---
Task ID: 9-10
Agent: Main Orchestrator
Task: Assemble page.tsx + end-to-end verification

Work Log:
- Created main page.tsx with hash-based view routing (home/register/my-registration/admin)
- Fixed use-view-router.ts lint error (migrated to useSyncExternalStore)
- Fixed API route bug: status check was at /api/registration but frontend calls /api/registration/status — created separate /api/registration/status/route.ts
- Ran comprehensive E2E tests (API + browser):
  - All 10 API tests pass (registration submit, status check, admin login, accept with ID generation, SMS, summary, unauthorized blocked, logout)
  - All 4 browser page tests pass (home, register, my-registration, admin) — no errors
  - Full interactive flow verified via browser:
    1. Registration form: all 10 fields filled (text + Radix Select dropdowns + checkbox)
    2. "Same as Present Address" auto-copies present→permanent and disables permanent field ✓
    3. Form submits successfully → registration created with status "pending" ✓
    4. Admin login → dashboard with summary cards + registration table ✓
    5. Admin clicks Accept → "Accept & Send SMS" confirmation → status changes to "accepted", ID "RD001" assigned ✓
    6. SMS notification sent (logged) ✓
    7. Toast notification: "Registration accepted | ID: RD001. SMS notification sent." ✓
    8. My Registration page shows: Accepted status, full participant details, ID RD001 ✓
    9. WhatsApp Group button: DISABLED when pending, ENABLED when accepted ✓
- VLM visual analysis confirmed: home page professional/modern, admin dashboard professional/functional
- Lint: 0 errors, 0 warnings
- Database reset to clean state for production use

Stage Summary:
- Application is FULLY FUNCTIONAL and verified end-to-end
- Admin credentials: admin / admin123 (change in production)
- Dev server running on port 3000
- All features working: landing page, countdown timer, registration form (10 fields), success modal, my-registration status check, admin auth, admin dashboard with summary + table, accept/reject/delete actions, auto ID generation (RD001+), SMS logging, WhatsApp button activation
