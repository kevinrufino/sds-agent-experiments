# Next steps: the smallest tests that would resolve the open questions

Ranked by value per unit of effort.

1. **E03 Code Connect, unblocked (needs your approval).**
   - **Setup:** point the `figma.config.json` substitutions at `mchDCUgpbpnntD9vMBJlzC` on an isolated branch, then publish the existing `src/figma/**/*.figma.ts` templates with a Code Connect-scoped token. This changes remote Figma state, which is why it wasn't done.
   - **Runs:** rerun the exact E02 prompt three times with Code Connect served and three times with `disableCodeConnect: true`.
   - **Measure:**
     - whether agents still open the `.figma.ts` files (they did in 3/3 E02 runs);
     - whether SDS `Form`/`SwitchGroup` reuse recovers (0/5 now);
     - whether hard-coded px CSS disappears.
   - **Cost:** about 6 runs plus one publish (and one unpublish afterwards).

2. **A harder semantic trap for E04 and E13 (no approval needed).** The current fixture hit a ceiling once guidance named `ButtonDanger`. Two changes would fix that:
   - **Fixture:** add a second ambiguity that no prompt or skill mentions, e.g. "Leave team" (a destructive action placed among neutral actions) or a "Transfer ownership" confirmation that should use `Dialog`.
   - **Guidance text:** have a third party write the skill and description text, so it doesn't encode the answer the orchestrator already knew.
   - **Design:** 3 arms (text-only / skill / Figma + descriptions) × 4 reps = 12 runs. That is enough to separate "follows stated guidance" from "infers semantics".

3. **A targeted guardrail instead of a generic validation loop (E14, small).**
   - **Rule:** add one ~15-line ESLint `no-restricted-syntax` rule to an experiment branch only: `IconButton`/`Button` whose `aria-label` or children match `/remove|delete/i` is an error, with the message "use ButtonDanger".
   - **Runs:** rerun E06 (validate) four times.
   - **Question:** a generic loop moved the destructive-variant score from 1/4 to 1/3. Does a semantic rule raise it to 4/4, and at what time cost?

Lower priority:
- **E10, ambiguity:** remove the mobile requirement and the error-state line from the brief, then compare against the current runs.
- **E11, stale example:** edit one story so it uses `Button variant="danger-primary"`, which no longer type-checks, and see whether agents copy it.
- **Scale check for E05:** repeat the full-dump condition with all of `src/` (about 10× larger) to see where a dump stops beating targeted search.
