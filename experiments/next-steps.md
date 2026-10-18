# Next steps

Ranked by value per unit of effort. Every experiment E01–E15 except E03 now has data; these steps address what is still uncertain.

1. **E03 Code Connect: needs an Organization or Enterprise Figma plan.**
   - **Setup:** move or copy the duplicate into a team on an Organization or Enterprise plan; a trial is fine if your policy allows one. Then send [`figma/e03_code_connect_payload_refused.json`](figma/e03_code_connect_payload_refused.json) with `send_code_connect_mappings`, or run `npx figma connect publish` with a Code Connect-scoped token.
   - **Runs:** rerun the E02 prompt three times with Code Connect served and three times with `disableCodeConnect: true`.
   - **Main question:** does Code Connect restore SDS `Form`/`SwitchGroup` usage? That usage is 0/8 in Figma runs today, and the templates don't cover `Form` either. So also test a `FormBox`/`Form` mapping for a frame-level container.

2. **Figma plus a structural skill (no approval needed, about 6 runs).** Combine the E02 prompt with the 12-line E13 skill, adding one line: "wrap editable fields in SDS `Form`; group switches in `SwitchGroup`". Check whether the Figma structural loss (0/8 `Form`) disappears while variant gains are kept. This is the most actionable open question.

3. **Blind guidance plus a novel trap (about 12 runs).**
   - **Guidance:** have someone other than the orchestrator write the skill and description text.
   - **Trap:** add a second semantic trap that no guidance mentions, e.g. a "Transfer ownership" confirmation that should use SDS `Dialog`.
   - **Design:** 3 arms (text-only / skill / Figma + descriptions) × 4 runs. This separates "follows stated rules" from "infers semantics", which E04, E12, E13 and E14 can't do.

Lower priority:
- **Raise text-only control n to about 12.** The batch effect (1/4, then 2/2) makes the baseline unstable.
- **E05 at scale:** dump all of `src/` (about 10× larger) and compare it against targeted search.
- **E10 with permission to ask:** allow one clarifying question. Measure whether agents ask about mobile and error states instead of guessing silently.
- **Upstream issue:** check whether SDS `FormBox` inside a `Section` overflows at 375 px (seen in E12-repodocs-r1). If so, file it upstream.
