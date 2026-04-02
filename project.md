# AGENTS.md

# AGENTS.md — AI Agent Instructions

This file defines how AI agents (Claude Code, GitHub Copilot, Cursor, etc.) should behave when working on this project. Read this file before making any changes.

---

## Project Summary

A multi-step React client intake form for a web design freelancer. Clients fill in a 7-step brief describing their website needs. On submit, a row is written to Google Sheets and a formatted HTML email is sent via EmailJS.

Stack: React 18 + TypeScript + Vite + Tailwind CSS v3 + React Hook Form + Framer Motion + EmailJS + Google Sheets API v4. Deployed on Vercel.

Full product requirements are in `PRD.md`. Read it before building any feature.

---

## Non-Negotiable Rules

- **Never commit `.env`** — it is in `.gitignore`. All secrets go in `.env.example` with empty values and instructions.
- **Never hardcode API keys, service IDs, or credentials** anywhere in source files. Always use `import.meta.env.VITE_*`.
- **Never use `create-react-app`** — this project uses Vite.
- **Never add a backend server** — all integrations are client-side.
- **Never install unnecessary dependencies** — check `PRD.md` tech stack before adding a package.
- **TypeScript strict mode is on** — no `any` types unless absolutely unavoidable and commented.
- **Do not modify `vercel.json`** unless explicitly instructed. The SPA rewrite rule must stay.

---

## Setup Instructions

### First-time setup

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom react-hook-form @hookform/resolvers zod
npm install framer-motion
npm install @emailjs/browser
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Environment setup

Copy `.env.example` to `.env` and fill in all values before running locally:

```bash
cp .env.example .env
```

Required values:
```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_SHEETS_API_KEY=
VITE_SHEETS_SPREADSHEET_ID=
VITE_SHEETS_RANGE=Sheet1!A1
```

### Run locally

```bash
npm run dev
```

---

## Build Order

Agents should build in this sequence to avoid dependency issues:

1. `tailwind.config.ts` — design tokens first
2. `src/types/brief.ts` — TypeScript interfaces
3. `src/lib/formSchema.ts` — Zod validation schema
4. `src/hooks/useMultiStep.ts` — step navigation hook
5. `src/components/ui/` — all reusable primitives (Chip, ChipGroup, etc.)
6. `src/components/layout/` — Navbar, Footer
7. `src/steps/` — all 7 step components
8. `src/lib/sheets.ts` — Google Sheets integration
9. `src/lib/emailjs.ts` — EmailJS integration + email HTML template
10. `src/pages/Landing.tsx`
11. `src/pages/BriefForm.tsx` — assembles all steps
12. `src/pages/ThankYou.tsx`
13. `src/App.tsx` — routing
14. `src/main.tsx` — entry point

---

## Component Conventions

### Chip (selectable option)

```tsx
// Chip.tsx — props
interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  colour?: 'default' | 'amber' | 'teal' | 'coral'; // visual accent on selected
}
```

Styling:
- Unselected: `border border-surface-border text-gray-400 rounded-full px-4 py-2 text-sm cursor-pointer`
- Selected: `border border-brand bg-brand/10 text-brand rounded-full px-4 py-2 text-sm cursor-pointer`
- Hover: `hover:border-brand/50 hover:text-gray-200`
- Transition: `transition-all duration-150`

### ChipGroup (multi-select)

Wraps multiple `Chip` components. Manages array selection state. Passes `selected[]` up via `onChange`.

### RadioChipGroup (single-select)

Same visual as ChipGroup but enforces single selection. Passes `string` (not array) via `onChange`.

### ProgressBar

```tsx
interface ProgressBarProps {
  current: number; // 1-indexed
  total: number;
}
```

Shows: `Step 3 of 7` label + a segmented or continuous bar filled to `(current / total) * 100%`.

### StepWrapper

Wraps each step with a Framer Motion `AnimatePresence` + `motion.div` for slide-in animation. Direction of animation should reverse when navigating back.

```tsx
// Animation variants
const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 60 : -60, opacity: 0 }),
};
```

---

## Step Content Reference

Refer to `PRD.md` for full option lists. Below is a condensed reference for agents:

### Step 1 — Business Info
- Business type (radio): Law firm, Real estate, Retail/shop, Restaurant/food, School/education, Healthcare, NGO/nonprofit, Freelancer/consultant, Other
- Existing site (radio): No — building from scratch, Yes — needs redesign, Yes — needs small updates only

### Step 2 — Website Purpose
- Goals (multi): Show services/portfolio, Generate enquiries/leads, Sell products online, Accept bookings, Share news/blog, Build credibility, Show contact info only
- Audience (radio): General public, Business clients (B2B), Both, Government/institutions

### Step 3 — Pages & Content
- Pages (multi): Home, About us, Services, Team profiles, Portfolio, Blog/news, Contact, FAQ, Shop, Gallery, Testimonials, Downloads
- Content source (radio): I will provide everything, Need help writing copy, Need help with photos/graphics, Need help with everything

### Step 4 — Features
- Features (multi): Contact form, WhatsApp button, Google Maps, Online payments (M-Pesa/card), Booking system, Live chat, Social media feeds, Newsletter signup, Password-protected area, Multi-language support, None of the above
- CMS (radio): Yes — needs simple CMS, No — I will manage updates, Not sure

### Step 5 — Design Preferences
- Brand status (radio): Full brand guidelines, Logo only, Partial elements, No — needs branding too
- Style (radio): Clean/minimal, Bold/modern, Corporate/formal, Warm/friendly, Creative/artistic
- Reference URLs: `<textarea>` — optional, placeholder "e.g. https://..."

### Step 6 — Timeline & Budget
- Timeline (radio): ASAP (under 2 weeks), 1 month, 2–3 months, No hard deadline
- Budget (radio, KES): Under 30,000, 30,000–60,000, 60,000–120,000, 120,000–250,000, 250,000+, Not sure yet

### Step 7 — Final Details
- Additional notes: `<textarea>` — optional
- Client name: `<input>` — required
- Client company: `<input>` — optional
- Client email: `<input type="email">` — required
- Client phone: `<input type="tel">` — optional

---

## Form State Management

Use React Hook Form with a single `useForm<BriefFormData>` at the `BriefForm.tsx` level. Pass `register`, `setValue`, `watch`, and `formState.errors` down to each step via props.

For chip selections (not native inputs), use `setValue` manually:

```tsx
// Multi-select chip
const current = watch('pagesNeeded') || [];
const toggle = (value: string) => {
  const next = current.includes(value)
    ? current.filter(v => v !== value)
    : [...current, value];
  setValue('pagesNeeded', next, { shouldValidate: true });
};
```

Validation schema lives in `src/lib/formSchema.ts` using Zod. Use `zodResolver` from `@hookform/resolvers/zod`.

---

## useMultiStep Hook

```typescript
// src/hooks/useMultiStep.ts
export function useMultiStep(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const next = () => {
    setDirection(1);
    setCurrentStep(s => Math.min(s + 1, totalSteps));
  };

  const back = () => {
    setDirection(-1);
    setCurrentStep(s => Math.max(s - 1, 1));
  };

  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  return { currentStep, direction, next, back, isFirst, isLast };
}
```

---

## Google Sheets Integration

File: `src/lib/sheets.ts`

- Use the REST API (no SDK needed): `POST https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{range}:append`
- Auth: API key in query param (`?key=VITE_SHEETS_API_KEY`)
- Value input option: `RAW`
- Row order must match the header row in the sheet exactly

```typescript
export async function logToSheet(data: BriefFormData): Promise<void> {
  const row = [
    new Date().toISOString(),
    data.clientName,
    data.clientCompany,
    data.clientEmail,
    data.clientPhone,
    data.businessType,
    data.hasExistingSite,
    data.websitePurpose.join(', '),
    data.targetAudience,
    data.pagesNeeded.join(', '),
    data.contentSource,
    data.featuresNeeded.join(', '),
    data.needsCMS,
    data.brandStatus,
    data.designStyle,
    data.referenceUrls,
    data.timeline,
    data.budgetRange,
    data.additionalNotes,
  ];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SHEETS_SPREADSHEET_ID}/values/${import.meta.env.VITE_SHEETS_RANGE}:append?valueInputOption=RAW&key=${import.meta.env.VITE_SHEETS_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });

  if (!response.ok) {
    throw new Error(`Sheets write failed: ${response.status}`);
  }
}
```

Create the Google Sheet manually first with these headers in row 1:
`Submitted At | Name | Company | Email | Phone | Business Type | Existing Site | Purpose | Audience | Pages | Content Source | Features | CMS | Brand Status | Style | Reference URLs | Timeline | Budget | Notes`

---

## EmailJS Integration

File: `src/lib/emailjs.ts`

```typescript
import emailjs from '@emailjs/browser';

export async function sendBriefEmail(data: BriefFormData): Promise<void> {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      client_name: data.clientName,
      client_email: data.clientEmail,
      client_company: data.clientCompany || '—',
      client_phone: data.clientPhone || '—',
      business_type: data.businessType,
      existing_site: data.hasExistingSite,
      purpose: data.websitePurpose.join(', '),
      audience: data.targetAudience,
      pages: data.pagesNeeded.join(', '),
      content_source: data.contentSource,
      features: data.featuresNeeded.join(', '),
      needs_cms: data.needsCMS,
      brand_status: data.brandStatus,
      design_style: data.designStyle,
      reference_urls: data.referenceUrls || '—',
      timeline: data.timeline,
      budget: data.budgetRange,
      notes: data.additionalNotes || '—',
      submitted_at: new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }),
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
}
```

### EmailJS Template (HTML)

Create this template in the EmailJS dashboard. Use inline styles only — no `<style>` blocks.

Key sections:
1. Header bar: dark background, white text "New Website Brief — {{client_name}}"
2. Timestamp: muted text, right-aligned
3. Client info card: Name, Company, Email, Phone in a 2-column table
4. Each form section as a bordered block with a coloured left accent
5. Budget + Timeline: render in a gold/amber badge — these are the most important fields for quoting
6. Notes section at the bottom
7. Footer: "Submitted via your website brief form"

All colours must be hex values inline. Suggested palette:
- Background: `#ffffff`
- Section heading: `#0f0f0f`
- Accent left border: `#F5C300`
- Badge background: `#FFF8DC`
- Badge text: `#7A5000`
- Muted text: `#666666`
- Divider: `#e5e5e5`

---

## Submit Handler

In `BriefForm.tsx`, the submit handler on the final step:

```tsx
const onSubmit = async (data: BriefFormData) => {
  setIsSubmitting(true);
  setSubmitError(null);

  try {
    // Run both in parallel; Sheets failure does not block email
    const results = await Promise.allSettled([
      logToSheet(data),
      sendBriefEmail(data),
    ]);

    const sheetResult = results[0];
    const emailResult = results[1];

    if (sheetResult.status === 'rejected') {
      console.error('Sheets logging failed:', sheetResult.reason);
    }

    if (emailResult.status === 'rejected') {
      throw new Error('Email send failed — submission not confirmed.');
    }

    navigate('/thank-you', { state: { data } });
  } catch (err) {
    setSubmitError('Something went wrong. Please try again or contact us directly.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Error Handling

- Form validation errors: show inline below the relevant field/group using `formState.errors`
- Network errors on submit: show a non-blocking error banner at the bottom of step 7
- Never swallow errors silently — always `console.error` at minimum
- If email fails: surface the error to the user (they need to know submission didn't go through)
- If Sheets fails: log only, do not surface to user (non-critical)

---

## Testing Checklist (Manual)

Before marking the build as complete, verify:

- [ ] All 7 steps render correctly
- [ ] Back navigation restores previous selections
- [ ] Progress bar updates on each step
- [ ] Required field validation blocks Next
- [ ] Textarea fields accept long input without layout breaking
- [ ] Submit writes a row to the Google Sheet
- [ ] Submit triggers the EmailJS email
- [ ] Thank-you page only accessible after successful submission
- [ ] Direct navigation to `/brief` works (Vercel routing)
- [ ] Responsive on mobile (375px viewport minimum)
- [ ] No console errors in production build (`npm run build && npm run preview`)

---

## Common Mistakes to Avoid

- Do not use `window.location.href` for navigation — use React Router's `useNavigate`
- Do not store form data in `localStorage` — use React Hook Form state
- Do not call `emailjs.init()` in a component render — call it once in `main.tsx` or inside the send function using the public key argument
- Do not use percentage widths on Tailwind grid inside form steps — use `gap` and `flex-wrap` for chip layouts
- Do not forget `vercel.json` with the SPA rewrite rule — without it, direct URL access returns 404

---

## Deployment Checklist

- [ ] All `VITE_*` env vars set in Vercel dashboard
- [ ] Google Sheet exists with correct headers in row 1
- [ ] Google Sheets API key restricted to the target spreadsheet and your Vercel domain
- [ ] EmailJS service and template configured and tested
- [ ] `vercel.json` present with SPA rewrite
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `.env` is in `.gitignore` and never committed


---

# AGENTS_v2.md

# AGENTS.md v2 — AI Agent Instructions

This file supersedes `AGENTS.md` v1. Read `PRD.md` and `CHANGES.md` before making any changes. `CHANGES.md` defines the three change sets to apply. This file defines conventions, patterns, and rules.

---

## Project Summary

A multi-step React client intake form for **Illustriober Creatives**, a web design freelancer based in Nairobi. Clients fill in a 7-step brief. On submit, data is saved to `localStorage` and an email is sent via EmailJS. A PIN-protected dashboard at `/dashboard` displays all submissions and stats.

Stack: React 18 + TypeScript + Vite + Tailwind CSS v3 + React Hook Form + Framer Motion + EmailJS. Deployed on Vercel. No backend. No external database.

---

## Non-Negotiable Rules

- **Never commit `.env`** — it is in `.gitignore`. All secrets go in `.env.example` with empty values.
- **Never hardcode API keys, PINs, or credentials** in source files. Always use `import.meta.env.VITE_*`.
- **No backend server** — all logic is client-side or via EmailJS.
- **No Google Sheets integration** — this was removed in v2. Use `src/lib/storage.ts` only.
- **TypeScript strict mode** — no `any` types without a comment explaining why.
- **Do not modify `vercel.json`** unless explicitly told to.
- **`crypto.randomUUID()`** is available in all modern browsers and Vite — use it for generating brief IDs. No UUID library needed.

---

## Project Structure (v2)

```
/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Chip.tsx
│   │   │   ├── ChipGroup.tsx            # Updated: allowOther prop
│   │   │   ├── RadioChipGroup.tsx       # Updated: allowOther prop
│   │   │   ├── ExpandableChipGroup.tsx  # New: Show More modal
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepWrapper.tsx
│   │   │   └── TextArea.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx               # Updated: new branding
│   │   │   └── Footer.tsx
│   │   └── dashboard/
│   │       ├── PinGate.tsx              # New
│   │       ├── StatCard.tsx             # New
│   │       ├── BriefCard.tsx            # New
│   │       └── BriefDetail.tsx          # New
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── BriefForm.tsx                # Updated: recordStart, saveBrief
│   │   ├── ThankYou.tsx
│   │   └── Dashboard.tsx               # New
│   ├── steps/
│   │   ├── Step1_BusinessInfo.tsx       # Updated
│   │   ├── Step2_Purpose.tsx            # Updated
│   │   ├── Step3_Pages.tsx              # Updated
│   │   ├── Step4_Features.tsx           # Updated
│   │   ├── Step5_Design.tsx
│   │   ├── Step6_Timeline.tsx
│   │   └── Step7_Anything.tsx
│   ├── data/
│   │   └── options.ts                   # New: full option lists
│   ├── lib/
│   │   ├── emailjs.ts
│   │   ├── storage.ts                   # New: localStorage layer
│   │   └── formSchema.ts                # Updated: *Other fields
│   ├── types/
│   │   └── brief.ts                     # Updated: *Other fields
│   ├── hooks/
│   │   └── useMultiStep.ts
│   ├── App.tsx                          # Updated: /dashboard route
│   ├── main.tsx
│   └── index.css
├── .env.example                         # Updated
├── .gitignore
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── PRD.md
├── CHANGES.md
└── AGENTS.md
```

---

## Build Order for New Files (Change Set 3)

If building the dashboard from scratch, follow this order:

1. `src/data/options.ts` — option lists (no dependencies)
2. `src/types/brief.ts` — update with `*Other` fields
3. `src/lib/formSchema.ts` — update with `*Other` fields
4. `src/lib/storage.ts` — localStorage layer
5. `src/components/ui/ExpandableChipGroup.tsx` — depends on ChipGroup
6. `src/components/dashboard/PinGate.tsx` — no dependencies
7. `src/components/dashboard/StatCard.tsx` — no dependencies
8. `src/components/dashboard/BriefDetail.tsx` — depends on types
9. `src/components/dashboard/BriefCard.tsx` — depends on BriefDetail
10. `src/pages/Dashboard.tsx` — depends on all dashboard components and storage
11. `src/App.tsx` — add `/dashboard` route

---

## Component Conventions

### ExpandableChipGroup

This is the primary chip group component for Steps 1–4. It wraps ChipGroup and adds:
- A "Show more options →" text button below the chips
- A modal overlay with search + full list
- An "Other" chip at the end that reveals a text input

```tsx
interface ExpandableChipGroupProps {
  label: string;
  defaultOptions: string[];    // shown as chips by default
  allOptions: string[];        // full list shown in modal
  selected: string[];
  onChange: (values: string[]) => void;
  multi?: boolean;             // default true; false = radio behaviour
  allowOther?: boolean;        // default true
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}
```

**Show More modal — implementation rules:**
- The modal must use `position: fixed` with `z-index: 50`
- Backdrop: `fixed inset-0 bg-black/60 z-40` as a sibling div, not a parent
- Modal card: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50`
- Search filters `allOptions` in real time using `.toLowerCase().includes(query.toLowerCase())`
- Options inside the modal are rendered as rows with a checkbox indicator, not chips
- Checkbox row: `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-surface-border`
- Checked indicator: a 16×16 square with `border border-brand bg-brand/20` + a checkmark SVG when selected
- Always show currently selected items at the top of the modal list, regardless of search
- "Done" button closes modal and retains selections — do not auto-close on selection
- Animate modal with Framer Motion: `initial={{ opacity: 0, scale: 0.95 }}` → `animate={{ opacity: 1, scale: 1 }}`

### PinGate

```tsx
// PinGate.tsx
// Full-screen PIN entry. Renders instead of the dashboard until authenticated.
// On correct PIN: sessionStorage.setItem('dashboard_auth', 'true') and call onSuccess()
// On incorrect PIN: show error message, clear input, do not lock out
```

- PIN field: single `<input type="password" maxLength={6}>` — centre-aligned, large font
- Submit on Enter key OR button click
- The PIN is compared against `import.meta.env.VITE_DASHBOARD_PIN`
- If env var is not set: show "Dashboard access is not configured."

### StatCard

```tsx
interface StatCardProps {
  label: string;
  value: number;
  accent?: 'gold' | 'red' | 'white';  // default 'white'
}
```

Styling:
- Card: `bg-surface-card border border-surface-border rounded-xl p-6`
- Value: `text-5xl font-medium` — colour from `accent` prop
  - gold: `text-brand`
  - red: `text-[#E57373]`
  - white: `text-white`
- Label: `text-sm text-brand/60 mt-1 tracking-wide uppercase`

### BriefCard

Collapsed state shows a summary row. Expanding it renders `BriefDetail` inline (not a modal — accordion style).

```tsx
interface BriefCardProps {
  brief: StoredBrief;
  onDelete: (id: string) => void;
}
```

Use `useState<boolean>` for expanded/collapsed toggle. Animate the expand with Framer Motion `AnimatePresence` + `motion.div` with `overflow: hidden`.

### BriefDetail

Renders all fields from a `StoredBrief` grouped by the 7 form steps. Each group has a section heading. Multi-select fields render as a wrapping row of small chips (read-only style: `border border-surface-border text-gray-400 text-xs px-2 py-1 rounded-full`).

---

## Storage Conventions

- `localStorage` key for briefs: `'illustriober_briefs'`
- `localStorage` key for stats: `'illustriober_stats'`
- Always wrap `localStorage` reads in try/catch — storage can be blocked in private mode
- `recordStart()` must be called exactly once per form visit, in a `useEffect` with `[]` dependency
- `saveBrief()` is called in the submit handler only after EmailJS confirms success

---

## Dashboard — Stats Calculation

```typescript
// In Dashboard.tsx
const briefs = getBriefs();
const stats = getStats();
const abandoned = Math.max(0, stats.started - stats.submitted);
const conversionRate = stats.started > 0
  ? Math.round((stats.submitted / stats.started) * 100)
  : 0;
```

**Top business types** (for the bar chart widget):

```typescript
const typeCounts = briefs.reduce((acc, b) => {
  const type = b.data.businessType || 'Other';
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const sorted = Object.entries(typeCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 6); // top 6
```

**Bar width:** `(count / maxCount) * 100`% — use inline style on a `div` with `background: #F5C300` and `height: 6px`.

**Most requested features:**

```typescript
const featureCounts = briefs.flatMap(b => b.data.featuresNeeded)
  .reduce((acc, f) => { acc[f] = (acc[f] || 0) + 1; return acc; }, {} as Record<string, number>);

const topFeatures = Object.entries(featureCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5);
```

---

## Routing (App.tsx)

```tsx
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/brief" element={<BriefForm />} />
  <Route path="/thank-you" element={<ThankYou />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
```

Do not add the dashboard link anywhere in the public-facing UI (Navbar, Landing, ThankYou). It is only accessible by direct URL.

---

## Submit Handler (Updated)

```tsx
const onSubmit = async (data: BriefFormData) => {
  setIsSubmitting(true);
  setSubmitError(null);

  try {
    await sendBriefEmail(data);    // EmailJS — if this fails, we don't save
    saveBrief(data);               // localStorage — synchronous
    navigate('/thank-you', { state: { data } });
  } catch (err) {
    console.error('Submit error:', err);
    setSubmitError('Something went wrong. Please try again or contact us directly.');
  } finally {
    setIsSubmitting(false);
  }
};
```

Note: `saveBrief` only runs if email succeeds. This ensures the submission count stays accurate — a failed email means the client never gets a response, so we shouldn't count it as submitted.

---

## Testing Checklist (v2)

### Change Set 1
- [ ] Navbar shows "Website Inquiry Form" on the left
- [ ] Navbar shows "Illustriober Creatives" on the right in gold
- [ ] On mobile, company name is either hidden or stacked cleanly

### Change Set 2
- [ ] Each step 1–4 shows "Other" as the last chip
- [ ] Selecting "Other" reveals a text input below the chip group
- [ ] Deselecting "Other" hides and clears the text input
- [ ] "Show more options →" button appears on Steps 1, 2, 4
- [ ] Modal opens on click with search input and full list
- [ ] Search filters options in real time
- [ ] Selections in modal persist when modal is closed
- [ ] "Edit extended selections (N)" label shows when extended options are selected
- [ ] Back navigation in the form preserves all chip selections including Other and extended

### Change Set 3
- [ ] `recordStart()` fires once when BriefForm mounts
- [ ] `saveBrief()` fires on successful submit
- [ ] `/dashboard` shows PIN gate
- [ ] Correct PIN grants access; incorrect PIN shows error
- [ ] Stats row shows started, submitted, abandoned counts
- [ ] Conversion rate bar renders correctly
- [ ] Submissions list shows newest first
- [ ] Expanding a card shows all fields grouped by step
- [ ] Delete button removes a submission (with confirmation)
- [ ] "Clear all data" removes everything (with confirmation)
- [ ] Top business types bar chart renders correctly with real data
- [ ] Most requested features list renders correctly

### General
- [ ] `npm run build` passes with no TypeScript errors
- [ ] No console errors on any page in production build
- [ ] Responsive on 375px viewport minimum

---

## Common Mistakes to Avoid

- Do not call `recordStart()` on every render — wrap in `useEffect(() => { recordStart(); }, [])` with empty deps
- Do not access `localStorage` during SSR — Vite/React is SPA only, this is not an issue here, but do not add any SSR configuration
- Do not render the dashboard link anywhere public-facing
- The `ExpandableChipGroup` modal must not scroll the page behind it — add `overflow-hidden` to `body` when modal is open and remove on close
- When deleting a brief, confirm with a native `window.confirm()` or a custom inline confirmation — do not delete on a single click
- "Clear all data" on the dashboard: require a second confirmation step before calling `clearAllData()`

---

## Deployment Checklist (v2)

- [ ] `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` set in Vercel
- [ ] `VITE_DASHBOARD_PIN` set in Vercel (choose a 4–6 digit PIN)
- [ ] `vercel.json` present with SPA rewrite rule
- [ ] `npm run build` passes locally before pushing
- [ ] `.env` is in `.gitignore` and never committed
- [ ] Test dashboard access on live Vercel URL after deploy


---

# CHANGES.md

# CHANGES.md — Implementation Spec (v2)

This document defines three change sets to be applied to the existing codebase. It is written for AI agents (Claude Code, Copilot, Cursor). Read `AGENTS.md` for project conventions before implementing.

Each change set is independent. Implement them in order: Change Set 1 → 2 → 3.

---

## Change Set 1 — Navbar Branding

### What to change

File: `src/components/layout/Navbar.tsx`

**Current state:**
- Left side displays "Studio" as the brand name
- No right-side content

**Required state:**
- Left side: rename "Studio" → **"Website Inquiry Form"** (use the same font/weight as current "Studio" text)
- Right side: add company name **"Illustriober Creatives"** in a muted, smaller weight — this is not a link, just a text label
- Both should be on the same horizontal baseline, separated by flex `justify-between`

**Implementation:**

```tsx
// Navbar.tsx
<nav className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
  <span className="text-white font-serif text-lg font-medium tracking-tight">
    Website Inquiry Form
  </span>
  <span className="text-brand/80 text-sm font-sans tracking-wide">
    Illustriober Creatives
  </span>
</nav>
```

**Notes:**
- "Illustriober Creatives" should use the gold/brand colour at 80% opacity so it's visible but secondary
- Do not make it a link — it is a label only
- Responsive: on mobile (< 640px), stack vertically OR hide the company name — do not let it wrap awkwardly

---

## Change Set 2 — Expandable Options with "Other" and "Show More"

### Overview

Every chip group in the form that lists categories should support two mechanisms:
1. **"Other" chip** — always visible as the last chip. When selected, reveals a text input so the user can type a custom value.
2. **"Show more" button** — for sections with a large option database, default chips show a curated short list. A "Show more" button expands to a searchable extended list loaded from a local data file.

This applies to: Step 1 (Business type), Step 2 (Website goals), Step 3 (Pages needed), Step 4 (Features).

---

### 2a — "Other" chip with text input

**Apply to:** All chip groups in Steps 1–4.

**Behaviour:**
- "Other" chip is always the last chip in every group
- When the user selects "Other", a text input appears immediately below the chip group with the label "Please describe:"
- The typed value is stored as `{fieldName}Other: string` in the form data
- If the user deselects "Other", the input disappears and its value is cleared
- On single-select groups (radio), selecting "Other" deselects any previously selected chip
- On multi-select groups, "Other" behaves as a toggleable chip alongside others

**Form schema additions** (add to `src/types/brief.ts` and `src/lib/formSchema.ts`):

```typescript
interface BriefFormData {
  // ... existing fields ...

  // "Other" free-text fields — one per chip group that has Other
  businessTypeOther: string;       // Step 1
  websitePurposeOther: string;     // Step 2
  pagesNeededOther: string;        // Step 3
  featuresNeededOther: string;     // Step 4
}
```

**Component update** — update `ChipGroup.tsx` and `RadioChipGroup.tsx` to accept an `allowOther` prop:

```tsx
interface ChipGroupProps {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  allowOther?: boolean;           // default false
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}
```

When `allowOther` is true:
- Always render an "Other" chip after the last option
- Track `otherSelected` in local state
- When `otherSelected` is true, render below the chips:

```tsx
<div className="mt-3">
  <input
    type="text"
    placeholder="Please describe..."
    value={otherValue}
    onChange={e => onOtherChange?.(e.target.value)}
    className="w-full bg-surface-card border border-surface-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50"
  />
</div>
```

---

### 2b — "Show more" with extended searchable list

**Apply to:** Step 1 (Business type), Step 2 (Website goals), Step 4 (Features).

**Behaviour:**
- Default state: show 8 curated chips (the existing list)
- A "Show more options →" text button appears below the chip group
- On click, a modal/overlay opens with:
  - A search input at the top ("Search options...")
  - A scrollable list of all available options (loaded from local data, not an API)
  - Options that are already selected show a checkmark/filled state
  - The user can select/deselect multiple options
  - A "Done" button closes the modal and updates the form state
- The overlay loads instantly (data is a local JS array, no network call)
- The "Show more options →" button label changes to "Edit extended selections (N)" if the user has selections from the extended list

**Data file:** Create `src/data/options.ts` with the full extended option lists (see Section 2c below).

**Component:** Create `src/components/ui/ExpandableChipGroup.tsx` — wraps `ChipGroup` and adds the Show More button and modal.

**Modal implementation:**
- Use a `div` with `position: fixed` and `z-index: 50` — full screen overlay on mobile, centred modal on desktop
- Dark semi-transparent backdrop: `bg-black/60`
- Modal card: `bg-surface-card border border-surface-border rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto`
- Search input filters the displayed list in real time (client-side filter, no debounce needed)
- Options in modal render as rows with a checkbox-style indicator, not chips (easier to scan a long list)

---

### 2c — Extended option database (`src/data/options.ts`)

```typescript
export const BUSINESS_TYPES = [
  // Default (shown as chips)
  'Law firm', 'Real estate', 'Retail / shop', 'Restaurant / food',
  'School / education', 'Healthcare', 'NGO / nonprofit', 'Freelancer / consultant',
  // Extended (shown in modal only)
  'Architecture firm', 'Accounting firm', 'Marketing agency', 'PR agency',
  'Events company', 'Wedding planner', 'Photography studio', 'Videography studio',
  'Interior design', 'Construction / contractor', 'Logistics / courier',
  'Transportation / fleet', 'Travel agency', 'Hotel / hospitality',
  'Salon / beauty', 'Gym / fitness', 'Pharmacy', 'Clinic / hospital',
  'Dental practice', 'Veterinary clinic', 'Church / religious org',
  'Political party / candidate', 'Sports club', 'Music / entertainment',
  'Tech startup', 'SaaS company', 'E-commerce brand', 'Fashion brand',
  'Food manufacturing', 'Agriculture / farm', 'Financial services',
  'Insurance', 'Investment firm', 'Microfinance / SACCO', 'Government agency',
  'County government', 'Research institution', 'University / college',
  'Primary / secondary school', 'Tutoring centre', 'Online courses',
  'Media / publishing', 'Radio station', 'TV station', 'Podcast',
  'Blog / content creator', 'Influencer / personal brand',
];

// Default = first 8 items. Extended = items after index 7.
export const DEFAULT_BUSINESS_TYPES = BUSINESS_TYPES.slice(0, 8);

export const WEBSITE_GOALS = [
  // Default
  'Show services / portfolio', 'Generate enquiries / leads', 'Sell products online',
  'Accept bookings / appointments', 'Share news / blog', 'Build credibility / trust',
  'Show contact info only',
  // Extended
  'Accept donations', 'Recruit / job listings', 'Host an online community',
  'Provide member-only content', 'Run an online course', 'Showcase a personal brand',
  'Launch a product / campaign', 'Share a digital menu', 'Provide customer support',
  'Collect feedback / surveys', 'Display a portfolio for clients',
  'Aggregate news or content', 'Run a directory or listing site',
  'Promote an event', 'Sell digital downloads', 'Offer subscriptions',
];

export const DEFAULT_WEBSITE_GOALS = WEBSITE_GOALS.slice(0, 7);

export const PAGES_NEEDED = [
  // Default (all shown as chips — these are finite)
  'Home', 'About us', 'Services', 'Team profiles', 'Portfolio', 'Blog / news',
  'Contact', 'FAQ', 'Shop', 'Gallery', 'Testimonials', 'Downloads',
  // Extended
  'Pricing page', 'Case studies', 'Careers / jobs', 'Events calendar',
  'Partners / clients', 'Press / media', 'Sitemap', 'Terms & conditions',
  'Privacy policy', 'Booking / reservations', 'Login / member area',
  'Product detail pages', 'Category pages', 'Search results page',
  'Thank you / confirmation page', 'Maintenance / coming soon page',
  '404 error page', 'Newsletter archive', 'Resource library',
];

export const DEFAULT_PAGES = PAGES_NEEDED.slice(0, 12);

export const FEATURES_NEEDED = [
  // Default
  'Contact form', 'WhatsApp button', 'Google Maps', 'Online payments (M-Pesa / card)',
  'Booking system', 'Live chat', 'Social media feeds', 'Newsletter signup',
  'Password-protected area', 'Multi-language support', 'None of the above',
  // Extended
  'Product search & filter', 'Wish list / favourites', 'Customer reviews',
  'Stock management', 'Coupon / promo codes', 'Loyalty programme',
  'SMS notifications', 'Push notifications', 'PDF generator / downloads',
  'Image gallery / lightbox', 'Video background or embed', 'Podcast player',
  'Event registration', 'Ticket sales', 'Donation button',
  'Member registration', 'User profiles', 'Forum / comments',
  'Staff directory with bios', 'Job application form', 'Quote request form',
  'Document upload', 'Appointment reminders', 'Customer portal',
  'Analytics dashboard', 'Heatmap / session recording', 'Cookie consent',
  'GDPR compliance tools', 'Accessibility features (WCAG)',
  'Countdown timer', 'Popups / lead capture', 'Exit intent popup',
  'Age verification', 'Geolocation / branch finder',
];

export const DEFAULT_FEATURES = FEATURES_NEEDED.slice(0, 11);
```

---

## Change Set 3 — Local Dashboard (No External Backend)

### Overview

Replace the Google Sheets integration entirely. Instead, store all form data in `localStorage` and build a password-protected dashboard at `/dashboard` that reads from it.

This is fully static — no API keys, no external services for data storage, no Google Cloud setup. Deploy straight to Vercel with zero configuration.

**Trade-off acknowledged:** Data is stored per-browser. If you clear browser data or access the site from a different device, submissions are not visible in that dashboard. This is acceptable for a freelance intake tool where you control the device. If cross-device access is needed in future, swap `localStorage` for a lightweight backend (e.g. Supabase free tier) — the dashboard component will not need to change.

**EmailJS is retained** for email notifications — that still fires on submit.

---

### 3a — Data storage (`src/lib/storage.ts`)

```typescript
const STORAGE_KEY = 'illustriober_briefs';
const STATS_KEY = 'illustriober_stats';

export interface StoredBrief {
  id: string;             // uuid v4
  submittedAt: string;    // ISO string
  status: 'submitted';
  data: BriefFormData;
}

export interface FormStats {
  started: number;        // incremented when /brief is first visited
  submitted: number;      // incremented on successful submit
  abandoned: number;      // calculated: started - submitted
}

// Increment started count when BriefForm mounts
export function recordStart(): void {
  const stats = getStats();
  stats.started += 1;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// Save a completed brief and increment submitted count
export function saveBrief(data: BriefFormData): StoredBrief {
  const brief: StoredBrief = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    data,
  };

  const existing = getBriefs();
  existing.unshift(brief); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  const stats = getStats();
  stats.submitted += 1;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));

  return brief;
}

export function getBriefs(): StoredBrief[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getStats(): FormStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : { started: 0, submitted: 0, abandoned: 0 };
  } catch {
    return { started: 0, submitted: 0, abandoned: 0 };
  }
}

export function deleteBrief(id: string): void {
  const updated = getBriefs().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
}
```

Call `recordStart()` in a `useEffect` on mount in `BriefForm.tsx` (only once, with an empty dependency array).

---

### 3b — Dashboard route and access

Route: `/dashboard`

**Access control:** Simple PIN gate — no user accounts needed. A 4–6 digit PIN stored in the Vite env:

```
VITE_DASHBOARD_PIN=1234
```

On first visit to `/dashboard`, show a full-screen PIN entry form. On correct entry, store `sessionStorage.setItem('dashboard_auth', 'true')` and render the dashboard. On incorrect PIN, show an error — no lockout for v1.

If `VITE_DASHBOARD_PIN` is not set, deny access with a message: "Dashboard access is not configured."

**Files to create:**
- `src/pages/Dashboard.tsx` — main dashboard page
- `src/components/dashboard/PinGate.tsx` — PIN entry screen
- `src/components/dashboard/StatCard.tsx` — metric summary card
- `src/components/dashboard/BriefCard.tsx` — individual submission card
- `src/components/dashboard/BriefDetail.tsx` — expanded view of a single submission

---

### 3c — Dashboard layout and content

**Colour theme:** Same as the main app — dark background (`#0F0F0F`), gold accent (`#F5C300`), card surfaces (`#1A1A1A`).

**Header:**
- Left: "Illustriober Creatives" wordmark + "Dashboard" label
- Right: "Clear all data" button (destructive, requires confirmation) + "Back to form" link

**Section 1 — Stats row (3 cards)**

| Card | Value | Colour |
|---|---|---|
| Forms started | `stats.started` | Neutral white |
| Submitted | `stats.submitted` | Gold / brand |
| Abandoned | `stats.started - stats.submitted` | Muted red (#E57373) |

Each card: large number (48px, font-weight 500), label below (14px, muted gold), subtle border, dark card background.

**Section 2 — Conversion rate bar**

A single horizontal progress bar showing `(submitted / started) * 100`% with a label: "X% completion rate". Render as a thin gold bar on a dark track. Show "No data yet" if `started === 0`.

**Section 3 — Submissions feed**

- Sorted newest first
- Each submission renders as a `BriefCard` (collapsed by default)
- `BriefCard` shows: client name, company, email, business type, budget, timeline, submitted date
- Clicking a card expands to `BriefDetail` showing all fields grouped by step
- Each card has a "Delete" button (with confirmation) — calls `deleteBrief(id)` and re-renders

**BriefCard collapsed view:**

```
┌─────────────────────────────────────────────────────┐
│ Jane Doe · Acme Ltd                    2 Jan 2026   │
│ jane@example.com                                    │
│ Law firm · 60,000–120,000 KES · 1 month        ↓   │
└─────────────────────────────────────────────────────┘
```

**BriefDetail expanded view — group fields by step:**

```
Business Info
  Type: Law firm
  Existing site: No — building from scratch

Website Purpose
  Goals: Show services / portfolio, Generate enquiries / leads
  Audience: Business clients (B2B)

Pages & Content
  Pages: Home, About us, Services, Contact
  Content source: I will provide everything

Features
  Features: Contact form, WhatsApp button, Google Maps
  CMS: Yes — needs simple CMS

Design Preferences
  Brand status: Logo only
  Style: Corporate / formal
  Reference URLs: https://example.com

Timeline & Budget
  Timeline: 1 month
  Budget: 60,000–120,000 KES

Additional Notes
  "Need the site before our official launch event."
```

**Section 4 — Additional recommended widgets (low implementation cost)**

Add these below the submissions feed:

1. **Top business types** — a simple horizontal bar chart showing frequency of each business type selected across all submissions. Implement with plain CSS width percentages — no chart library needed.

2. **Budget distribution** — a row of budget range labels each showing a count badge. Pure HTML/CSS.

3. **Most requested features** — top 5 features by count across all submissions, shown as a ranked list with a count pill.

4. **Recent activity timeline** — a vertical list of the last 10 events (form started / form submitted) with timestamps and icons. Pull from `getBriefs()` and `getStats()`.

All four use data already in `localStorage` — no extra data collection needed.

---

### 3d — Remove Google Sheets integration

- Delete `src/lib/sheets.ts`
- Remove `VITE_SHEETS_*` variables from `.env.example` and all docs
- Replace the `logToSheet()` call in the submit handler with `saveBrief(data)` from `src/lib/storage.ts`
- Update the submit handler:

```tsx
const onSubmit = async (data: BriefFormData) => {
  setIsSubmitting(true);
  setSubmitError(null);

  try {
    saveBrief(data);                    // localStorage — synchronous, never fails
    await sendBriefEmail(data);         // EmailJS — async, can fail
    navigate('/thank-you', { state: { data } });
  } catch (err) {
    setSubmitError('Something went wrong sending your brief. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### 3e — Updated `.env.example`

```
# EmailJS — https://www.emailjs.com/
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=

# Dashboard PIN — set a 4-6 digit number
VITE_DASHBOARD_PIN=
```

---

### 3f — Updated `vercel.json`

No changes needed. The existing SPA rewrite handles `/dashboard` correctly.

---

## Summary — Files Changed / Created

| File | Action |
|---|---|
| `src/components/layout/Navbar.tsx` | Edit — branding update |
| `src/components/ui/ChipGroup.tsx` | Edit — add `allowOther` prop |
| `src/components/ui/RadioChipGroup.tsx` | Edit — add `allowOther` prop |
| `src/components/ui/ExpandableChipGroup.tsx` | Create — Show More modal |
| `src/data/options.ts` | Create — full extended option lists |
| `src/steps/Step1_BusinessInfo.tsx` | Edit — use ExpandableChipGroup + Other |
| `src/steps/Step2_Purpose.tsx` | Edit — use ExpandableChipGroup + Other |
| `src/steps/Step3_Pages.tsx` | Edit — use ExpandableChipGroup + Other |
| `src/steps/Step4_Features.tsx` | Edit — use ExpandableChipGroup + Other |
| `src/lib/storage.ts` | Create — localStorage data layer |
| `src/lib/sheets.ts` | Delete |
| `src/pages/BriefForm.tsx` | Edit — recordStart on mount, saveBrief on submit |
| `src/pages/Dashboard.tsx` | Create — main dashboard page |
| `src/components/dashboard/PinGate.tsx` | Create |
| `src/components/dashboard/StatCard.tsx` | Create |
| `src/components/dashboard/BriefCard.tsx` | Create |
| `src/components/dashboard/BriefDetail.tsx` | Create |
| `src/App.tsx` | Edit — add `/dashboard` route |
| `src/types/brief.ts` | Edit — add `*Other` fields |
| `src/lib/formSchema.ts` | Edit — add `*Other` fields |
| `.env.example` | Edit — remove Sheets vars, add PIN |
| `AGENTS.md` | Superseded — see updated version |


---

# PRD.md

# Client Website Brief Form — Product Requirements Document

## Overview

A React web application that collects structured project briefs from prospective web design clients. The form replaces informal discovery calls as a first-touch intake tool. On submission, responses are logged to a Google Sheet and a formatted HTML email is sent to the designer.

Deployed on Vercel. No backend server. All integrations handled via third-party APIs from the frontend.

---

## Goals

- Reduce time spent on discovery calls for incomplete briefs
- Give the designer enough information to produce an accurate quote
- Minimise typing for the client — prefer selections, chips, and sliders
- Present a professional, branded experience that builds confidence in the designer

---

## Non-Goals

- No user accounts or authentication
- No client-facing response summary or PDF generation
- No payment processing
- No CMS or admin dashboard
- No multi-language support (English only, v1)
- No database — Google Sheets is the data store

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 (Vite) | Fast build, wide agent/tooling support |
| Language | TypeScript | Type safety for form state |
| Styling | Tailwind CSS v3 | Utility-first, no design system overhead |
| Routing | React Router v6 | Landing page + form page + thank-you page |
| Form state | React Hook Form | Minimal re-renders, easy validation |
| Email sending | EmailJS | Client-side email, free tier sufficient |
| Sheet logging | Google Sheets API v4 | Direct write via service account |
| Secrets | Vite env vars (`.env`) | Injected at build time via Vercel env settings |
| Deployment | Vercel | Auto-deploy on push to `main` |
| Animations | Framer Motion | Page transitions and step animations |

---

## Project Structure

```
/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable primitives
│   │   │   ├── Chip.tsx          # Selectable chip button
│   │   │   ├── ChipGroup.tsx     # Multi-select chip container
│   │   │   ├── RadioChipGroup.tsx# Single-select chip container
│   │   │   ├── ProgressBar.tsx   # Step progress indicator
│   │   │   ├── StepWrapper.tsx   # Animated step container
│   │   │   └── TextArea.tsx      # Styled textarea input
│   │   └── layout/
│   │       ├── Navbar.tsx        # Minimal top bar with logo placeholder
│   │       └── Footer.tsx        # Minimal footer
│   ├── pages/
│   │   ├── Landing.tsx           # Landing page with CTA
│   │   ├── BriefForm.tsx         # Multi-step form (steps 1–7)
│   │   └── ThankYou.tsx          # Confirmation page after submit
│   ├── steps/                   # One file per form step
│   │   ├── Step1_BusinessInfo.tsx
│   │   ├── Step2_Purpose.tsx
│   │   ├── Step3_Pages.tsx
│   │   ├── Step4_Features.tsx
│   │   ├── Step5_Design.tsx
│   │   ├── Step6_Timeline.tsx
│   │   └── Step7_Anything.tsx
│   ├── lib/
│   │   ├── emailjs.ts            # EmailJS send logic + HTML email template
│   │   ├── sheets.ts             # Google Sheets write logic
│   │   └── formSchema.ts         # Zod schema for full form
│   ├── types/
│   │   └── brief.ts              # TypeScript interfaces for form data
│   ├── hooks/
│   │   └── useMultiStep.ts       # Step navigation hook
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .env                          # Never committed
├── .gitignore
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── PRD.md
└── AGENTS.md
```

---

## Pages

### 1. Landing Page (`/`)

- Full-viewport hero section
- Designer name / studio name (placeholder text, easy to swap)
- One-line value proposition: *"Tell us what you need. We'll tell you what it costs."*
- Large primary CTA button: **"Start Your Brief →"** — navigates to `/brief`
- Optional: a subtle secondary line listing estimated time to complete (e.g. "Takes about 4 minutes")
- Clean, minimal design — dark background with a single accent colour (configurable via Tailwind config)
- No images required — typographic layout only

### 2. Brief Form (`/brief`)

Multi-step form. One step visible at a time. Steps are:

| Step | Title | Input type |
|---|---|---|
| 1 | Business info | Radio chips (business type) + radio chips (existing site) |
| 2 | Website purpose | Multi-select chips (goals) + radio chips (audience) |
| 3 | Pages & content | Multi-select chips (pages) + radio chips (content source) |
| 4 | Features | Multi-select chips (features) + radio chips (CMS need) |
| 5 | Design preferences | Radio chips (brand status) + radio chips (style) + textarea (reference URLs) |
| 6 | Timeline & budget | Radio chips (timeline) + radio chips (budget range KES) |
| 7 | Anything else | Textarea (open field) + text inputs (name, company, email, phone) |

**Navigation:**
- Back / Next buttons on each step
- Progress bar at top showing current step out of 7
- Validation: required fields block Next — show inline error
- Final step: "Submit Brief" button (not "Next")
- All selections persist if user navigates back

**Required fields:**
- Step 1: business type, existing site
- Step 2: at least one purpose selected, audience
- Step 3: at least one page selected, content source
- Step 4: at least one feature OR "None of the above", CMS
- Step 5: brand status, style
- Step 6: timeline, budget
- Step 7: name, email (company and phone optional)

### 3. Thank You Page (`/thank-you`)

- Confirmation message
- Summary of key selections (business type, budget, timeline)
- "We'll be in touch within 1 business day" message
- Button to return to landing page
- Triggered only after successful form submission (not directly accessible)

---

## Form Data Schema

```typescript
interface BriefFormData {
  // Step 1
  businessType: string;
  hasExistingSite: string;

  // Step 2
  websitePurpose: string[];
  targetAudience: string;

  // Step 3
  pagesNeeded: string[];
  contentSource: string;

  // Step 4
  featuresNeeded: string[];
  needsCMS: string;

  // Step 5
  brandStatus: string;
  designStyle: string;
  referenceUrls: string;

  // Step 6
  timeline: string;
  budgetRange: string;

  // Step 7
  additionalNotes: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
}
```

---

## Integrations

### Google Sheets Logging

- On submit, write one row to a designated Google Sheet
- Columns map 1:1 to `BriefFormData` fields, plus a `submittedAt` timestamp
- Auth: Google Sheets API v4 with an API key (read/write restricted to the target sheet)
- Sheet ID and API key stored in `.env`
- If the Sheets write fails, do not block the email — log error to console and proceed

**Environment variables:**
```
VITE_SHEETS_API_KEY=
VITE_SHEETS_SPREADSHEET_ID=
VITE_SHEETS_RANGE=Sheet1!A1
```

### Email Notification (EmailJS)

- Trigger on successful form submission
- Recipient: designer's email (configured in EmailJS dashboard)
- Template: HTML email with structured layout (see Email Template section)
- Service ID, template ID, and public key from EmailJS stored in `.env`

**Environment variables:**
```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

### Email Template Design

The EmailJS template should render a well-structured HTML email:

- Header: "New Website Brief Received" + submission timestamp
- Client info block: name, company, email, phone
- Each form section as a labelled block with values listed
- Multi-select fields rendered as comma-separated tags
- Budget and timeline highlighted in a coloured badge
- Footer: "Submitted via [your site URL]"
- Style: white background, dark headings, accent colour for badges, clean sans-serif
- Compatible with Gmail, Outlook, Apple Mail (use inline styles only — no `<style>` blocks in email body)

---

## Deployment

### Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

This ensures React Router handles all routes correctly on Vercel (SPA routing fix).

### Environment Variables on Vercel

All `VITE_*` variables must be added in:
Vercel Dashboard → Project → Settings → Environment Variables

They are injected at build time — not runtime secrets.

### Deploy Steps

1. Push repo to GitHub
2. Import project on vercel.com
3. Set all environment variables
4. Deploy — Vercel auto-detects Vite

---

## Design Tokens (Tailwind Config)

Configure in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: '#F5C300',   // Primary accent (gold — matches Rowlands Griffins palette)
        dark: '#C49A00',
      },
      surface: {
        DEFAULT: '#0F0F0F',   // Page background
        card: '#1A1A1A',      // Card / step background
        border: '#2A2A2A',    // Subtle borders
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    }
  }
}
```

> Swap `brand.DEFAULT` to match whatever client brand colour is needed.

---

## Constraints & Decisions

| Decision | Rationale |
|---|---|
| No backend server | Simplifies deployment; Vercel functions not needed |
| EmailJS over Nodemailer | No server required; free tier handles low volume |
| Google Sheets over Airtable | Zero cost, client can view responses without extra login |
| Vite over CRA | Faster builds, better DX, actively maintained |
| Framer Motion for animation | Step transitions feel polished without custom CSS |
| TypeScript strict mode | Catches form schema mismatches early |
| No database | Volume doesn't justify it; Sheets is sufficient |

---

## Known Limitations (v1)

- No spam protection (add reCAPTCHA in v2 if needed)
- No file upload (logos, references) — client pastes URLs instead
- EmailJS free tier: 200 emails/month — sufficient for freelance volume
- Google Sheets API key is public (client-side) — mitigate by restricting key to the specific Sheet ID and HTTP referrers in Google Cloud Console
- No submission deduplication

---

## Future Enhancements (Out of Scope for v1)

- Auto-generated quote estimate based on selections
- PDF brief summary emailed to client on submission
- ClickUp task creation on submission (MCP available)
- Admin dashboard to view and filter submissions
- reCAPTCHA v3 integration
- Multi-language support (Swahili)


---

