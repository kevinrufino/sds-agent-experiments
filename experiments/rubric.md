# Preregistered protocol

Written before the independent page-generation runs. All conditions use the same repaired source commit, dependencies, task brief, existing AGENTS.md files, tool permissions, and fresh agent context. One repetition per condition; no seed/temperature control exposed. No Figma context is supplied. Full shared task instructions and only the intentional treatment suffix are stored in prompts/. Agent model/version is inherited from this Cloud task; exact API identifier and token usage are not exposed by collaboration tools (N/A). No extra paid services.

## Task and controlled factors

E01: control receives the shared Team Settings brief; treatment adds one explicit instruction to search SDS documentation, APIs, and stories before coding. Existing repository AGENTS.md already recommends API inspection in both arms, so this tests additional prompting in an instruction-rich repository, not discovery from zero context.

E13: control is the E01 control (shared comparator, disclose dependency); treatment receives a concise local SDS skill in addition to exactly the same shared task. This is a repository-guidance proxy, not an installed plugin or Figma experiment. The skill is included as prompt text, avoiding unequal filesystem changes. Not independent replication of E01.

E06: preserve E01 control's initial implementation, duplicate that exact output into a separate branch, give one fresh repair agent the measured compiler/lint/browser findings and permit one repair round. Evaluator executes the same checks before and after. It is a within-artifact validation comparison, not two independent generations. If all initial checks pass, record no observed improvement; never introduce artificial defects.

E07/E08/E15 are shared diagnostic checks on these pages, not extra randomized comparisons. E02/E03/E04 require live Figma MCP/Code Connect/description access; if absent mark BLOCKED. Do not substitute checked-in mappings or imagined design context. Other IDs are NOT RUN unless separately evidenced.

## Fixed requirements

Team Settings heading; labeled name/email fields initialized with local data; notification toggle; two existing team members with labeled role selectors; Save and Cancel; invalid email prevents save and exposes an accessible error; Cancel restores initial state; successful save feedback; responsive 390px and 1440px layouts. Add a disabled invitation action and a destructive remove-member action so variant selection is testable. No backend, authentication, external APIs, new primitive library, CSS framework, or design-system rewrites. Use local static data and existing SDS. Approximately 200 lines of new page code. Only App.tsx and one optional TeamSettings.tsx may change, no new CSS. The common brief includes this entire requirement list for every generation.

## Objective scoring

- Eligible UI instances: visible interactive controls in initial loaded page (one each for name, email, notification toggle, two role selectors, Save, Cancel, invitation, two destructive remove actions = 10). Count SDS-backed instances / 10; enumerate source evidence. Additional duplicate controls reported separately. Native structural form/list/section markup excluded.
- Correct selection: 6 opportunities: Save primary, Cancel neutral/subtle, invitation disabled, destructive action danger variant, notification controlled, invalid input error exposure. Numerator / 6; actual behavior verified where possible.
- Inventions: new primitive abstractions duplicating SDS; local TeamSettings feature composition is allowed.
- Completeness: 9 checks: heading, populated fields, toggle state, role change, invalid save/error, successful save feedback, Cancel restoration, disabled invitation, destructive removal.
- Checks: isolated app build (tsc && vite build); focused lint of generated files; Chromium desktop/mobile behavior, accessible names, keyboard focus spot check, horizontal overflow. Record full baseline lint separately; do not attribute pre-existing errors to a condition.
- Error counts: compiler diagnostics and lint errors counted separately; failing behavioral assertions separately. Skips not passes. Browser spot checks are not a full WCAG audit. Pixel fidelity N/A without matching Figma frame.
- Corrections: count post-generation agent repair rounds only; initial self-edits are separate/unknown. One round maximum for E06. No feedback-driven edits in E01/E13 before scoring.
- Retrieval: use the instrumented retrieve.py helper for code reads/searches. It writes timestamps, arguments, hashes, bytes, and output to each run trace; these are actual repository retrievals, not Figma MCP calls. Automatically loaded instructions are outside this capture. Agent action trace is separately labeled self-reported. Token counts N/A; never infer from bytes.
- Wall duration: measured from spawn/finish observations; includes tool waits. Exact inner model generation time N/A.

## Judgment

Optional system consistency, accessibility, completeness, maintainability scores must cite concrete evidence and be labeled reviewer judgments; do not infer pixel fidelity. Primary comparisons report raw counts and single-run limitations. Do not equate fewer retrievals with better quality.
