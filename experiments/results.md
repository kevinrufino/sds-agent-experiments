# Results: SDS agent experiments

**Date:** 2026-10-18 · **Baseline:** `05525f7` · **Runs:** 21 isolated agent runs across 7 conditions, plus 1 reference implementation · **Figma file:** duplicate `mchDCUgpbpnntD9vMBJlzC`, fixture frame [`3005:3`](https://www.figma.com/design/mchDCUgpbpnntD9vMBJlzC/Simple-Design-System--Community-?node-id=3005-3)

## Executive summary

- **Completed:** E01, E02, E04, E05, E06 and E13 as matched pairs with 2–4 repetitions each. E02 and E04 were **REAL** Figma MCP runs; the rest were code-only. E07, E08 and E09 were scored as rubric dimensions across all 21 runs. E15 was run on the reference implementation.
- **Blocked:** E03 (Code Connect). The duplicate file has no published Code Connect mappings, and publishing them needs your approval. **Not run:** E10, E11, E12 and E14.
- **Every run was already good on the basics.** All 21 runs:
  - added **0** new TypeScript errors, **0** ESLint errors in changed files, and **passed** `vite build`;
  - passed **9/9** scripted behaviour checks;
  - used **0** raw `<button>`/`<input>`/`<select>` where SDS has a component, and **0** direct `react-aria-components` imports;
  - invented **0** new design-system primitives.

  The conditions differed in **semantic variant choice**, not in reuse or correctness.
- **Biggest observed difference: the destructive "Remove" action.** `Button` deliberately excludes danger variants, so the correct choice is `ButtonDanger` or `DestructiveIconButton`.

  | Context the run had | Correct destructive variant |
  | --- | --- |
  | Repository only (text-only control, search, validation) | **4/10** runs |
  | Explicit or complete design-system context (Figma frame, Figma + descriptions, full docs dump, concise skill) | **11/11** runs |

  Fisher exact test on that split: p = 0.004. **Confidence: moderate.** The grouping was chosen after seeing the data, and each pre-planned pair alone is underpowered (best p = 0.14, n = 3–4).
- **What got worse with Figma context:** agents copied what the frame shows. All 5 Figma runs dropped SDS `Form` (versus 1 of the 16 other runs), and the 3 E02 runs also dropped `SwitchGroup`. All 5 rebuilt the member list with a raw `<ul>` and CSS that hard-codes the frame's pixel widths.
- **The validation loop (E06) caught nothing.** The `tsc`/`eslint`/`build` loop found no errors to fix in 3/3 runs. It cost about 55% more wall time, and it cannot catch the variant mistake: 1/3 correct, versus 1/4 in the control.

## Results by experiment

Every number below comes from [`matrix.csv`](matrix.csv) and [`runs/summary.json`](runs/summary.json). Token columns:
- **"Cumulative input"** is the sum over the run's API calls of input + cache-read + cache-write tokens, taken from the transcript.
- **"Final context"** is the token count the harness reported when the run finished.
- **Output tokens are `N/A`**: the streamed transcript records only partial output usage, so those counts are unreliable and are not reported.

| Condition | n | Remove uses destructive variant | Reuse (of 15) | Variants (of 5) | Tool calls | Cumulative input tokens | Final context | Wall time | Extra CSS files |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| text_only (shared control) | 4 | **1/4** | 14.25 | 4.25 | 9.5 | 817k | 98k | 80 s | 2/4 |
| search (E01 treatment) | 3 | 2/3 | 14.67 | 4.67 | 12.3 | 1,119k | 110k | 90 s | 1/3 |
| validate (E06 treatment) | 3 | 1/3 | 13.67 | 4.00 | 11.7 | 1,039k | 104k | 124 s | 0/3 |
| fulldump (E05 control) | 3 | **3/3** | 15.00 | 5.00 | **7.3** | **504k** | 130k | **69 s** | 0/3 |
| skill (E13 treatment) | 3 | **3/3** | 15.00 | 5.00 | 8.7 | 730k | **86k** | 73 s | 0/3 |
| figma (E02 treatment / E04 control) | 3 | **3/3** | 15.00 | 5.00 | 13.7 | 1,262k | 120k | 93 s | 3/3 |
| figma + descriptions (E04 treatment) | 2 | **2/2** | 15.00 | 5.00 | 14.5 | 1,252k | 114k | 88 s | 2/2 |

### E01: Can a text-only agent discover and use the design system? (CODE-ONLY)

- **Control** (brief only, 4 runs): reuse was high, at 14–15 of 15. Every run read `src/AGENTS.md` without being asked; it is the repo's own instruction file. Remove was a plain `IconButton` with a trash icon in 3/4 runs. The fourth used `DestructiveIconButton`.
- **Treatment** ("search design-system references first", 3 runs): 2/3 chose `ButtonDanger`. Treatment runs read more stories and docs (the `stories` grep hits are in the traces). They cost about 30% more tool calls and 37% more cumulative input tokens.
- **Retrieval was not the bottleneck.** Control run [`E01-control-r1`](traces/E01-control-r1.md) printed all of `Button.tsx` (which defines `ButtonDanger`) and `IconButton.tsx` (which defines `DestructiveIconButton`) with `cat`, then still chose `IconButton`. The agent had seen the right component; it picked the wrong one.
- **Verdict:** a weak positive (2/3 vs 1/4, p = 0.49). Telling the agent to search raises cost more reliably than it raises correctness.

### E02: Does Figma design context help? (REAL)

Each run's evidence is in [`traces/E02-treatment-r*.figma-context.json`](traces/).
- **Figma usage:** every treatment run made exactly **one** Figma MCP call, `get_design_context` on `3005:3`, which returned about 35k characters plus a screenshot. Each run also loaded the `figma-design-to-code` skill.
- **What the response contained:** a "Component descriptions" block for 6 components, including **Button Danger: "Keywords: action, negative, destructive"**. There was no Code Connect data.
- **Agents reached for code mappings anyway.** All 3 treatment runs then opened the repo's checked-in `src/figma/**/*.figma.ts` templates themselves to map Figma components to code (e.g. `cat figma/primitives/button/ButtonDanger.figma.ts` in [`E02-treatment-r1`](traces/E02-treatment-r1.md)). Two of the runs say this in their final reports.
- **Variant choice:** Remove was `ButtonDanger` (`danger-subtle`, small) in 3/3 runs, versus 1/4 in the control.
- **Fidelity costs some consistency.** All 3 Figma runs added a CSS file with hard-coded `200px` widths taken from the frame (the select was 200 wide), plus custom flex rules for member rows. The rubric counts that as custom layout CSS. Fewer non-Figma runs added CSS: 3 of 15 (`css_lines` column).
- **Avatars:** Figma runs used the `placeholder` image, following the template mapping, rather than initials.
- **What got worse with Figma:** 0/5 Figma runs used SDS `Form`, versus 15/16 other runs, and 0/3 E02 runs used `SwitchGroup`. Structure that isn't visible in the frame was rebuilt with raw `<form>`/`<ul>` or dropped (see E08).
- **Fixture equivalence:** the frame was built from the same SDS instances the brief describes, so the comparison is like-for-like at the level of components. Pixel fidelity was not measured; see the screenshots side by side for a visual comparison.

### E03: Code Connect (BLOCKED)

- **No mappings exist for the duplicate.** `get_code_connect_map` returned `{}` for the Button set `4185:3778`, the variant `4185:3779` and Switch Field `9762:1902`. No `get_design_context` response contained a Code Connect snippet.
- **The repo's templates point elsewhere.** `figma.config.json` points at the upstream key `J0KLPKXiONDRssXD1AX9Oi`, and publishing to the duplicate would change remote state. The handoff and your settings both require explicit approval for that, so it was not done.
- **What would unblock it:** approve `npx figma connect publish` with a Code Connect write-scoped token after switching the file-key substitutions to `mchDCUgpbpnntD9vMBJlzC`. Then rerun the E02 prompt with and without `disableCodeConnect`.
- **A related finding from E02:** with no Code Connect served, Figma-guided agents read the repo's `.figma.ts` templates directly, which serves as a partial substitute for Code Connect.

### E04: Do Figma component descriptions convey semantic use? (REAL)

- **Treatment:** description-only changes on 10 component masters in the duplicate. Each new description names the code component and its props and gives usage guidance, e.g. "Use for destructive actions … The regular Button component does not accept danger variants". All of them were restored afterwards; the before and after text is in [`figma/e04_descriptions.json`](figma/e04_descriptions.json).
- **The new text reached the agents.** Both treatment runs received it verbatim in the `get_design_context` "Component descriptions" block, which grew from 6 components to 10 ([`traces/E04-treatment-r1.figma-context.json`](traces/E04-treatment-r1.figma-context.json)). Figma stores the quotes HTML-escaped (`&quot;`), but the MCP response unescaped them.
- **Quality was already at ceiling** in the control (the E02 treatment runs: 15/15 reuse, 5/5 variants, 3/3 destructive). The treatment could not show a quality gain: 2/2 runs scored 15/15 and 5/5.
- **Retrieval behaviour changed.** The control runs opened `src/figma/*.figma.ts` templates in **3/3** runs; the treatment runs did so in **0/2** and relied on the descriptions instead. Treatment runs also used initials instead of the template's `placeholder` avatar. Tool calls and tokens were essentially unchanged (14.5 vs 13.7 calls; 1.25M vs 1.26M cumulative input).
- **Verdict:** descriptions are retrieved and do steer how the agent looks things up. A quality effect is unproven on this fixture.

### E05: Targeted retrieval vs a full context dump (CODE-ONLY)

- **Control:** the agent read `DESIGN_SYSTEM_DOCS.md` up front: 4,132 lines (about 25–30k tokens) made of every `AGENTS.md` plus all `src/ui` component source. It then used 3/3 `ButtonDanger`, 15/15 reuse, and the **fewest tool calls (7.3), lowest cumulative input (504k) and fastest time (69 s)**. Its final context was the largest (130k).
- **Treatment:** the search runs, shared with E01: 2/3 destructive, 12.3 calls, 1,119k cumulative input, 90 s.
- **Verdict:** at SDS's size, a full dump was cheaper and slightly more accurate than self-directed search. Two caveats: this probably doesn't scale to a large design system, and the dump was a file the agent had to read rather than text in the prompt.

### E06: Does a validation loop reduce violations? (CODE-ONLY)

- **The loop had nothing to catch.** In the control, all 4 runs had 0 new `tsc` errors, 0 ESLint errors, and builds that passed (checked after the fact). In the treatment, the validation pass found nothing to repair in 3/3 runs: r1 and r3 ran a single pass, and r2 ran a second pass after reformatting.
- **Cost:** about 55% more wall time on average (124 s vs 80 s; r2 took 179 s). There were no correction loops caused by errors.
- **It doesn't check the right things.** Destructive-variant correctness was 1/3, the same as the control; r1 also omitted `ButtonGroup`.
- **Verdict:** generic typecheck/lint/build guardrails bring no measurable benefit for this task. The violations that do occur are semantic, and these tools cannot see them.

### E13: Minimal instructions vs a design-system skill (CODE-ONLY)

- **Treatment:** a 12-line SDS skill appended to the prompt ([`prompts/extra_skill.md`](prompts/extra_skill.md)). Runs scored 3/3 `ButtonDanger`, 15/15 reuse and 5/5 variants. They had the lowest final context (86k), and the second-lowest tool calls and time.
- **All 3 created a local `MemberRow` composition,** which the skill explicitly allowed. That kept the abstraction local to the page, the intended boundary (E09).
- **Verdict:** a strong positive for a small, cheap intervention (3/3 vs 1/4, p = 0.14 at this sample size).

### E07, E08, E09: variant correctness, composition, abstraction boundary (scored across all runs)

- **E07: variant opportunities V1–V5.** These are: destructive Remove, non-primary Cancel, Save with `isDisabled`, a disabled locked switch, and the alert variant for errors. V2, V3 and V5 were correct in 21/21 runs. V4 was correct in 20/21: [`E06-treatment-r3`](runs/E06-treatment-r3/) used `isReadOnly`, a defensible alternative but not the SDS disabled state. V1 is the variant that differed between conditions (see the table above).
- **E08: composition.** Every run used `InputField`, `SwitchField`, `SelectField`, `Avatar`, `Notification`, `Section` and `Flex` (21/21), plus `AvatarBlock` (20/21) and `ButtonGroup` (20/21; [`E06-treatment-r1`](diffs/E06-treatment-r1.patch) skipped it). **Non-visual structural wrappers depended on the condition:**
  - **SDS `Form`:** used in 15/16 non-Figma runs but **0/5 Figma runs**. Three Figma runs wrote a raw `<form>`, and two submitted via `onPress` with no form element.
  - **`SwitchGroup`:** **0/3** in the E02 runs (the frame has no Switch Group), versus 18/18 in all other runs.
  - **Member list:** all 5 Figma runs used a raw `<ul>` plus custom CSS; most others used `Flex` with list roles.

  So frame-driven agents rebuild what is visible in the frame and drop SDS structure that isn't drawn. Four runs (2 search, 2 full-dump) wrapped sections in `Card`; no run with explicit guidance did.
- **E09: abstraction boundary.** Across 21 runs there were 0 new design-system primitives. Local abstractions appeared only where the prompt allowed them (`MemberRow` ×3 in the skill runs) or once without prompting (`SettingsSection` in E06-r2). No run extracted a shared component.

### E15: Comprehensive validation of the reference implementation (CODE-ONLY)

The reference page ([`src/examples/TeamSettings.tsx`](../src/examples/TeamSettings.tsx)) was written by the orchestrator after all runs had finished:

| Check | Result |
| --- | --- |
| New `tsc` errors | 0 (still the 7 baseline errors) |
| ESLint on changed files | 0 errors |
| `vite build` | pass |
| Behaviour checks | 9/9 |
| Keyboard | 10 tab stops: inputs → switches → role selects and Remove buttons → Cancel; disabled controls are skipped |
| Labels | 0 unlabelled controls |
| Headings | `h1` → three `h2` |
| Mobile (375 px) | no horizontal overflow |

Screenshots: [`screenshots/reference-desktop.png`](screenshots/reference-desktop.png), [`screenshots/reference-mobile.png`](screenshots/reference-mobile.png).

**Remaining defects:**
- Disabled owner controls can't receive focus, so their explanations aren't reachable by keyboard; that is SDS/react-aria default behaviour.
- `TextContentTitle` (not used in the reference) renders an `h2` on mobile. At least 7 runs noticed this pre-existing SDS quirk independently, and 2 of them (`E02-treatment-r3`, `E06-treatment-r2`) avoided the component because of it.

## Manual review

Automated scoring is regex-based. Each run's remove control, buttons, notifications and title were checked by hand ([`harness/keys.sh`](harness/keys.sh)). Overrides, also listed in [`harness/build_matrix.py`](harness/build_matrix.py):
- `E05-control-r3` and `E02-treatment-r3`: R01 page title. The regex failed both, but each uses `TextTitleHero`/`TextTitlePage` through a runtime alias, so both are **passes**.
- `E01-control-r4` and `E06-treatment-r2`: `DestructiveIconButton` counts as a correct destructive variant (it was already in the rubric).

The negative control works: the behaviour test fails 9/9 on the unmodified baseline.

## Confounds and invalid comparisons

1. **Shared controls.** The text-only runs are the control for E01, E02, E06 and E13, and the Figma runs are the control for E04. The conditions also differ in more than one way: Figma runs had a visual target and component names, while text-only runs did not.
2. **Small samples.** Pairs had n = 2–4. No pre-planned pairwise test reaches p < 0.05. The pooled 11/11 vs 4/10 split is **post hoc**.
3. **The repo already instructs agents.** `src/AGENTS.md` ("Never create new components…") was present in every condition, which probably explains the reuse ceiling.
4. **E04 hit a ceiling.** The fixture had no remaining error for the descriptions to fix. A harder ambiguity is needed (see `next-steps.md`).
5. **E05 dump delivery.** The dump was a file read up front rather than text in the prompt. The "do not open other files" rule also changes behaviour beyond the context size.
6. **Not controllable:** model version, temperature and seed. Runs were launched in parallel batches, and the model identifier is withheld by policy.
7. **Unreliable metrics:** output tokens are `N/A`. The "corrections" count is approximate, because edits made through `python`/`sed` inside Bash are detected by pattern. It also includes one agent's Prettier reformat.
8. **The orchestrator is not blind.** The same agent designed the rubric, the fixture and the skill text, and its knowledge of the `ButtonDanger` trap shaped both the skill and the E04 descriptions. The skill and descriptions therefore state the answer to the main differentiating item, so read E13 and E04 as tests of "does stated guidance get followed", not of discovery.

## Three conclusions (prioritised)

1. **Teach semantics, not existence.** Agents found and reused SDS components in every condition; the failures were semantic choices, such as a trash `IconButton` instead of the danger variant. The two cheap interventions that state usage rules, a 12-line skill and Figma frames whose components carry semantic names and descriptions, gave 6/6 correct, versus 1/4 with the repo alone.
2. **Don't count on generic validation loops for design-system adherence.** Typecheck, lint and build were clean without a loop and missed the only real defects. To guard adherence, write a targeted rule (e.g. "an `onPress` that removes data must use `ButtonDanger`") or keep the guidance in context; don't add a generic loop.
3. **Figma context works on a duplicated file today without Code Connect, but agents build their own mapping and copy only what is drawn.** One `get_design_context` call delivered component names and descriptions, and agents filled the gap by reading the repo's `.figma.ts` templates. Descriptions that name the code component removed that lookup. The cost: structure the frame doesn't draw (SDS `Form`, `SwitchGroup`) was dropped in 5/5 Figma runs, and design pixel widths went into custom CSS. Whether published Code Connect would fix this is untested (E03 is blocked).
