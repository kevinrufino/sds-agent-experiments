# Results: SDS agent experiments

**Date:** 2026-10-18 · **Baseline:** `05525f7` · **Runs:** 44 isolated agent runs across 13 conditions, plus 1 reference implementation · **Figma file:** duplicate `mchDCUgpbpnntD9vMBJlzC`, fixture frame [`3005:3`](https://www.figma.com/design/mchDCUgpbpnntD9vMBJlzC/Simple-Design-System--Community-?node-id=3005-3)

## Executive summary

- **Status of all 15 experiments:**
  - **Run as experiments:** E01, E02, E04, E05, E06 and E10–E14, with 2–6 repetitions per arm. E02, E04 and E10-figma were **REAL** Figma MCP runs; the rest were code-only.
  - **Scored across every run:** E07, E08 and E09.
  - **Run on the reference page:** E15.
- **E03 (Code Connect) is BLOCKED by plan tier, not by permission.** Writing mappings to your duplicate through the Figma MCP was refused, both as a full template and as a simple mapping: *"Code connections can only be made in libraries that are in Organization or Enterprise plans"*. The account is Professional. Upgrading means buying a plan, which the budget rule excludes, so E03 still has no real data. The payload that would have been published is in [`figma/e03_code_connect_payload_refused.json`](figma/e03_code_connect_payload_refused.json).
- **Every run was solid on the basics.** All 44 runs:
  - added **0** new TypeScript errors and **0** ESLint errors in changed files, and **passed** `vite build`;
  - passed every behaviour check their brief required (9/9; 8/9 for the reduced E10 brief, which no longer asked for a page-level error);
  - used **0** raw `<button>`/`<input>`/`<select>` where SDS has a component, and made **0** direct `react-aria-components` imports;
  - invented **0** new design-system primitives.

  The conditions differed in **semantic and structural choices**, not in reuse or correctness.
- **Most consistent signal: the destructive "Remove" action.** `Button` deliberately excludes danger variants, so the correct choice is `ButtonDanger` or `DestructiveIconButton`.

  | Context | Correct destructive variant |
  | --- | --- |
  | Repo only (text-only control, "search first", generic validation) | 6/12 |
  | Explicit usage guidance (concise skill in the prompt, the same text in repo docs, a targeted lint rule) | 12/12 |
  | Complete or visual context (full docs dump, Figma frame, Figma + descriptions) | 11/11 |

  **Confidence: moderate.** The pre-planned confirmatory test (text-only n=6 vs skill n=6) gave 3/6 vs 6/6, p = 0.18, which is **not significant**. Text-only runs r4–r6 all chose correctly, which weakened the earlier 1/4 control. The pooled split (repo-only 6/12 vs explicit context 14/14, p = 0.004) is post hoc.
- **Most consistent trade-off: Figma context drops SDS structure that the frame doesn't draw.** SDS `Form` was used in **0/8** Figma runs versus **31/36** non-Figma runs. The new E10-figma arm reproduced it (0/3), after it was first seen in E02 and E04. All 8 Figma runs also rebuilt the member list with a raw `<ul>` plus custom CSS.
- **Stale documentation (E11) did not mislead.** 0/6 runs copied a deliberately wrong `Button variant="danger-subtle"` example from `src/AGENTS.md`. All 6 used the destructive component the types allow, and 2 explicitly flagged the doc conflict.
- **Validation loops:** a generic `tsc`/`eslint`/`build` loop fixed nothing (E06). A **targeted lint rule** (E14) fired in 1/3 runs and that agent corrected `IconButton` to `DestructiveIconButton`, for 3/3 correct, versus 1/3 with the generic loop.

## Results by condition

Every number comes from [`matrix.csv`](matrix.csv) and [`runs/summary.json`](runs/summary.json).
- **Cumulative input** = input + cache-read + cache-write tokens, summed over the run's API calls.
- **Final ctx** = the harness-reported token count when the run ended.
- **Output tokens** are `N/A` (the streamed transcripts record them only partially).
- **`Form` / `SwitchGroup`** count runs that used those SDS wrappers.
- **375 px overflow** counts runs with horizontal page overflow at that width.

| Condition | n | Destructive Remove | Reuse /15 | Variants /5 | Tool calls | Cumulative input | Final ctx | Time | `Form` | `SwitchGroup` | 375 px overflow |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| text_only (shared control) | 6 | **3/6** | 14.17 | 4.50 | 10.0 | 832k | 96k | 79 s | 4/6 | 6/6 | 0 |
| search (E01 treatment) | 3 | 2/3 | 14.67 | 4.67 | 12.3 | 1,119k | 110k | 90 s | 3/3 | 3/3 | 0 |
| validate (E06 treatment) | 3 | 1/3 | 13.67 | 4.00 | 11.7 | 1,039k | 104k | 124 s | 3/3 | 3/3 | 0 |
| validate + targeted lint rule (E14) | 3 | **3/3** | 14.67 | 5.00 | 10.3 | 888k | 97k | 119 s | 3/3 | 3/3 | 0 |
| skill in prompt (E13) | 6 | **6/6** | 15.00 | 5.00 | 8.5 | 717k | **86k** | 74 s | 6/6 | 6/6 | 0 |
| same skill text in `src/AGENTS.md` (E12) | 3 | **3/3** | 15.00 | 5.00 | 11.3 | 980k | 98k | 82 s | 2/3 | 3/3 | 1 |
| full docs dump (E05 control) | 3 | **3/3** | 15.00 | 5.00 | **7.3** | **504k** | 130k | **69 s** | 3/3 | 3/3 | 0 |
| stale doc, no validation (E11) | 3 | 3/3 | 15.00 | 5.00 | 10.0 | 818k | 96k | 83 s | 3/3 | 3/3 | 1 |
| stale doc + validation (E11) | 3 | 3/3 | 15.00 | 5.00 | 9.7 | 793k | 95k | 83 s | 1/3 | 3/3 | 1 |
| reduced brief, text (E10) | 3 | 2/3 | 14.67 | 3.67\* | 8.3 | 714k | 96k | 70 s | 3/3 | 3/3 | 1 |
| figma (E02 treatment / E04 control) | 3 | **3/3** | 15.00 | 5.00 | 13.7 | 1,262k | 120k | 93 s | **0/3** | **0/3** | 0 |
| figma + descriptions (E04 treatment) | 2 | **2/2** | 15.00 | 5.00 | 14.5 | 1,252k | 114k | 88 s | **0/2** | 2/2 | 0 |
| reduced brief, figma (E10) | 3 | **3/3** | 15.00 | 5.00 | 13.0 | 1,188k | 118k | 86 s | **0/3** | 2/3 | 0 |

\* The reduced E10 brief didn't ask for a page-level error, so V5 (alert variant) had no instance to score in those runs.

### E01: Can a text-only agent discover and use the design system? (CODE-ONLY)

- **Control** (6 runs): reuse was 14–15 of 15. Every run read the repo's own `src/AGENTS.md` without being asked. The destructive variant was right in 3/6: r1–r3 used a plain trash `IconButton`; r4–r6 used `DestructiveIconButton`, `ButtonDanger` and `DestructiveIconButton`.
- **Treatment** ("search design-system references first", 3 runs): 2/3 correct. It cost about 25% more tool calls and 35% more cumulative input.
- **Retrieval is not the bottleneck.** [`E01-control-r1`](traces/E01-control-r1.md) printed the whole of `Button.tsx`, which defines `ButtonDanger`, and still picked `IconButton`.
- **Verdict:** no reliable effect (p = 1.0). "Search first" costs more without measurably improving the choice.

### E02: Does Figma design context help? (REAL)

- **Retrieval:** each Figma run made **one** MCP call, `get_design_context` on `3005:3`, returning about 35k characters plus a screenshot and a "Component descriptions" block. That block included *Button Danger: "Keywords: action, negative, destructive"*. There was no Code Connect data.
- **Agents built their own mapping.** With no Code Connect, all 3 E02 runs opened the repo's `src/figma/**/*.figma.ts` templates to map components ([`E02-treatment-r1`](traces/E02-treatment-r1.md)).
- **Gains:** destructive variant 3/3, versus 3/6 for text-only (p = 0.46).
- **Costs:**
  - **SDS `Form` was dropped** in 0/3 runs here, 0/8 across all Figma runs, versus 31/36 non-Figma runs. The frame shows no form, so agents rebuilt one as a raw `<form>` or used none.
  - **`SwitchGroup` was dropped** in 0/3 E02 runs (the frame has none).
  - **Custom CSS:** every Figma run added a CSS file with the frame's pixel widths (e.g. a `200px` select) and a raw `<ul>`.

### E03: Code Connect (BLOCKED, plan tier)

The test needs real Code Connect data served by the Figma MCP. Here is what happened when I tried to create it:

1. **Discovery worked.** `get_code_connect_suggestions(3005:3)` listed 13 unmapped components, and `get_context_for_code_connect(185:852)` returned Button Danger's properties.
2. **Preparation:** I converted the repo's existing parserless templates (`src/figma/**/*.figma.ts`) for those 13 components into MCP mappings, with sources pointing at this fork ([`figma/e03_code_connect_payload_refused.json`](figma/e03_code_connect_payload_refused.json)).
3. **The write was refused.** `add_code_connect_map` failed, both with the full template and as a simple mapping without one: *"Code connections can only be made in libraries that are in Organization or Enterprise plans"* (Figma debug IDs `75f47513-…` and `594d2233-…`).
4. **The CLI route is also closed.** `npx figma connect publish` would need a `FIGMA_ACCESS_TOKEN`, which this environment doesn't have, and it is subject to the same plan restriction.

**What would unblock it:**
- the duplicate file living in an Organization or Enterprise team (a paid plan, not bought here, per the budget rule); or
- read-only access to a file in such a team that already has SDS Code Connect published. The upstream community file was excluded by your instruction.

The closest available evidence is from E02 and E04: without Code Connect, agents read the repo's `.figma.ts` templates directly (3/3), and descriptions that name the code component replaced that lookup (0/2 read them).

### E04: Do Figma component descriptions convey semantic use? (REAL)

- **Treatment:** description-only edits on 10 component masters in the duplicate, restored afterwards; before and after text is in [`figma/e04_descriptions.json`](figma/e04_descriptions.json). Both treatment runs received the new text verbatim in `get_design_context`, and the descriptions block grew from 6 components to 10.
- **Quality:** already at ceiling in the control (5/5 variants, 3/3 destructive). The treatment held 2/2 with no measurable gain.
- **Retrieval behaviour changed:** the template lookup in `src/figma` dropped from 3/3 runs to 0/2.
- **What didn't change:** the descriptions did not restore `Form`, which was 0/2 again. No description mentioned `Form`, because the frame contains no form component to describe.

### E05: Targeted retrieval vs a full context dump (CODE-ONLY)

- **Full dump** (a 4,132-line `DESIGN_SYSTEM_DOCS.md` read up front): 3/3 destructive, 15/15 reuse. It had the **fewest tool calls (7.3)**, the **lowest cumulative input (504k)** and the **fastest time (69 s)**, though the largest final context (130k).
- **Targeted search** (the E01 treatment): 2/3 destructive, 12.3 calls, 1,119k cumulative input.
- **Verdict:** at SDS's size (about 30k tokens of docs), a full dump was cheaper and at least as accurate. This probably doesn't scale to much larger systems (next-steps.md).

### E06: Does a validation loop reduce violations? (CODE-ONLY)

- **The loop had nothing to catch.** Text-only runs already had 0 new `tsc`/lint errors (6/6), and the treatment's validation pass found nothing to repair.
- **Cost:** about 57% more wall time (124 s vs 79 s), for 1/3 destructive versus 3/6 in the control.
- **Verdict:** generic typecheck, lint and build can't see the semantic defects that actually occur. (E14 tests a targeted rule.)

### E10: How does the agent handle ambiguity? (CODE-ONLY and REAL)

- **Brief change:** the same brief with item 7 (mobile at 375 px) removed, and the page-level error dropped from item 6 ([`prompts/base_ambiguous.md`](prompts/base_ambiguous.md)).
- **Text arm** (3 runs):
  - **Page-level error:** 0/3 added one; they followed the brief literally (behaviour B3 failed, as expected).
  - **Mobile:** 2/3 had no responsive logic at all (no `useMediaQuery`), and **1/3 overflowed horizontally at 375 px**. Under the full brief, 3/38 runs overflowed, and none of the 9 text-only or search runs.
  - **Assumptions:** none of the 3 mentioned mobile or the omitted requirements in their stated assumptions.
- **Figma arm** (3 runs, same reduced brief plus the frame):
  - **Page-level error:** 3/3 rebuilt the alert banner from the frame ("1 field needs attention").
  - **Mobile:** 2/3 still added mobile padding through `useMediaQuery`, and 0/3 overflowed. One run noted explicitly: "the design shows only desktop".
  - **`Form`:** 0/3, the same structural loss as E02.
- **Verdict:**
  - Text-only agents fill gaps **silently**, which caused a real regression (overflow).
  - A design artifact is good evidence for **states it shows** (the error banner) but says nothing about states it doesn't (mobile).
  - No run asked a question or flagged the gap, partly because the prompt allowed no questions.

### E11: Stale example vs the TypeScript API (CODE-ONLY)

- **Fixture:** `src/AGENTS.md`, the file every run reads, was given a "Destructive actions use the danger variants of Button" example: `<Button variant="danger-primary">` / `<Button variant="danger-subtle">`. `Button`'s type rejects that ([`diffs/fixture-E11.patch`](diffs/fixture-E11.patch)).
- **Results:**
  - **Exposure:** traces show the stale doc being read in 5/6 runs (the 6th is unclear, because traces cut long commands).
  - **Copying:** **0/6 copied the stale example.** All 6 used `ButtonDanger` (5) or `DestructiveIconButton` (1).
  - **Flagging:** 2/6 called out the conflict in their reports, e.g. [`E11-validate-r3`](runs/E11-validate-r3/agent_report.md): *"src/AGENTS.md shows `Button variant="danger-subtle"`, but Button's type doesn't allow danger variants, so I used ButtonDanger"*.
  - **Validation:** made no difference (3/3 vs 3/3). The type error was never written, so there was nothing to catch.
- **Side effect:** the stale example **raised** destructive-variant correctness to 6/6, versus 3/6 for the control. It put the topic in front of the agent, and the agent resolved it against the types.
- **Verdict:** agents trusted the types over the prose and resolved the conflict safely.

### E12: Does the placement of guidance matter? (CODE-ONLY)

- **Setup:** the same 8-bullet usage text was placed in three ways:
  - in the **prompt**, as E13's skill (6 runs);
  - in **repo docs**, appended to `src/AGENTS.md` (3 runs);
  - as **Figma component descriptions**, in E04 (similar code-mapping content, not identical text, 2 runs).
- **Destructive variant:** 6/6, 3/3 and 2/2. The guidance worked wherever it was placed.
- **Abstraction:** the skill's "feature-specific pieces (e.g. a member row) stay local" line produced a local `MemberRow` in **6/6 prompt runs and 0/3 repo-docs runs**. In-prompt guidance shaped structure more strongly.
- **Cost:** repo-docs runs used more calls and input than prompt runs (11.3 vs 8.5 calls; 980k vs 717k), because they had to find and read the docs.
- **Mobile:** one repo-docs run overflowed at 375 px, from SDS `FormBox` (see E15).

### E13: Minimal instructions vs a concise skill (CODE-ONLY, pre-planned confirmatory repeats)

- **Skill** (6 runs): 6/6 destructive, 15/15 reuse, 5/5 variants, 6/6 `Form` and `SwitchGroup`, no CSS files. It had the lowest final context (86k), and lower cumulative input than the control (717k vs 832k).
- **Control** (6 runs): 3/6. **p = 0.18, not significant at n = 6.**
- **Verdict:** the effect is consistent in direction, and the skill made runs cheaper. But the control's later runs did well, so the gap is smaller than the first 4 control runs suggested.

### E14: Prose rules vs a targeted guardrail (CODE-ONLY)

- **Fixture:** one ESLint `no-restricted-syntax` rule that flags `Button`/`IconButton` with a trash icon, "remove"/"delete" text, or a remove/delete aria-label ([`harness/e14_eslint_rule.cjs`](harness/e14_eslint_rule.cjs)). It was tested beforehand: it flagged every earlier wrong run and none of the correct ones. The prompt was identical to E06.
- **Results:** 3/3 correct.
  - **r2:** wrote `IconButton`. The rule fired on the first validation pass, and the agent switched to `DestructiveIconButton`: **1 real guardrail-driven correction**.
  - **r1 and r3:** chose a destructive variant up front. The rule never fired, and neither run read the rule config.
- **Comparison:**
  - **Generic validation (E06):** 1/3.
  - **Prose rule (E13 skill):** 6/6 with no extra time.
  - **Lint rule:** 3/3 at about 50% more wall time than no validation, because it runs inside a validation loop.
- **Verdict:** a targeted rule converts a silent semantic defect into one the agent fixes. Prose guidance gets there with no loop when it is in context.

### E07, E08, E09: scored across all runs

- **E07 (variants V1–V5):**
  - **V2** (non-primary Cancel), **V3** (Save with `isDisabled`) and **V5** (alert variant, where an error exists): correct in every run.
  - **V4** (locked switch disabled): correct in every run but one, [`E06-treatment-r3`](runs/E06-treatment-r3/), which used `isReadOnly` (defensible).
  - **V1** (destructive Remove): the variant that varies with condition (tables above).
- **E08 (composition):**
  - **Always used:** `InputField`, `SwitchField`, `SelectField`, `Avatar`, `Notification`, `Section` and `Flex`.
  - **`ButtonGroup`:** 40/44. It was missing in E01-control-r5 and r6, E06-treatment-r1 and E14-treatment-r2.
  - **SDS `Form`:** 31/36 non-Figma runs versus **0/8 Figma runs**.
  - **`SwitchGroup`:** missing only in Figma runs (0/3 E02, 1 of 3 E10-figma).
- **E09 (abstraction boundary):** 0 new design-system primitives across 44 runs. Local helpers appeared only where invited (`MemberRow` in 6/6 skill runs) or once without prompting (`SettingsSection` in E06-r2).

### E15: Comprehensive validation (reference implementation and run sweep)

**Reference page** ([`src/examples/TeamSettings.tsx`](../src/examples/TeamSettings.tsx)):

| Check | Result |
| --- | --- |
| New `tsc` errors | 0 |
| ESLint | 0 |
| `vite build` | pass |
| Behaviour checks | 9/9 |
| Keyboard | 10 tab stops |
| Labels | 0 unlabelled controls |
| Headings | `h1` → `h2` ×3 |
| Mobile (375 px) | no overflow |

[Desktop](screenshots/reference-desktop.png) · [mobile](screenshots/reference-mobile.png) screenshots.

**Defects found across the sweep:**
- **Overflow at 375 px in 4/44 runs** (E10-text-r2, E11-text-r3, E11-validate-r3, E12-repodocs-r1). Each comes from a bordered, padded "card" container: three were custom CSS copying the `FormBox` pattern, and one was SDS `FormBox` itself. So `FormBox` likely overflows at 375 px inside a `Section`; that is an **upstream issue**.
- **Mobile heading level:** at least 7 runs noticed that `TextContentTitle` renders an `h2` on mobile (an upstream SDS quirk), and 2 avoided the component because of it.
- **Disabled owner controls** can't be focused, so their explanations aren't keyboard-reachable (react-aria default).

## Manual review

Automated scoring is regex-based; the remove control, buttons, notifications and title were checked by hand in every run.
- **R01 overrides:** `E05-control-r3` and `E02-treatment-r3` set the title through a runtime alias. The regex missed them; both are **passes**.
- **R10:** `DestructiveIconButton` counts as correct.
- **E11 exposure** was checked in traces. **E14 rule firing** was checked in the raw tool results.
- **Behaviour-test validity:** the behaviour test fails 9/9 on the unmodified baseline.

## Confounds and invalid comparisons

1. **Shared controls.** The text-only runs are the control for E01, E02, E06 and E13; the Figma runs are the control for E04; the E06 runs are the control for E14.
2. **Small n.** Pairs had 2–6 runs. Only the post-hoc pooled split is significant. The pre-planned E13 confirmatory test was not (p = 0.18).
3. **Batch and time effects.** The control was 1/4 in the first two batches and 2/2 in the third (r5, r6). Runs were launched in parallel batches at different times, and the model, temperature and seed can't be controlled.
4. **The repo already instructs agents.** `src/AGENTS.md` ("never create new components") was present everywhere and likely caused the reuse ceiling.
5. **The orchestrator is not blind.** The same agent wrote the rubric, fixture, skill, descriptions and lint rule, all knowing about the `ButtonDanger` trap. E04, E12, E13 and E14 therefore test whether **stated guidance is followed**, not whether agents discover it.
6. **E05 delivery:** the dump was a file read up front, not inline prompt text.
7. **E12 equivalence:** the Figma-description arm (E04) used similar but not identical text, and was a different modality with a frame.
8. **Metric reliability:** output tokens are `N/A`, and the "corrections" count is approximate.
9. **Unrunnable:** E03 cannot run on a Professional plan.

## Conclusions (prioritised)

1. **Teach semantics where the agent will read it.** Agents found and reused SDS in every condition; the defects were semantic: the destructive variant, plus mobile behaviour when unspecified. A short usage rule fixed the destructive choice every time (12/12 across E12, E13 and E14), whether it sat in the prompt, the repo docs or a lint rule. Prompt placement was cheapest, and also shaped local structure.
2. **Use targeted guardrails, not generic loops.** Generic `tsc`/lint/build loops added about 50% wall time and caught nothing. A single targeted lint rule caught and fixed the one semantic defect that occurred. Conflicting docs were resolved against the types, so the type system is already a reliable last line of defence for API mistakes.
3. **Figma context needs structural guidance alongside it.** Frames improved variant choice and filled states the brief omitted (the error banner). They also consistently dropped non-visual SDS structure (`Form` 0/8 vs 31/36) and introduced pixel CSS. Code Connect might fix this, but can't be tested without an Organization or Enterprise plan. Until then, pair Figma context with a short skill that names the structural components (next-steps.md).
