# Autonomous Figma Design-System Agent Experiments — Cloud Handoff

**Prepared:** 2026-10-18  
**Objective:** Run controlled experiments overnight with minimal new Figma artifacts and minimal new production code. Produce reproducible evidence on which context sources and constraints make AI coding agents use existing design-system components correctly.

## Execution contract: read this first

You are an autonomous cloud coding/research agent. Execute now, not just plan. Prefer completing a smaller number of valid, reproducible experiments over claiming that all experiments ran. Continue without asking routine questions. Do not misrepresent simulated Figma data as live MCP results.

**Source baseline:** Figma's official Simple Design System (SDS): https://github.com/figma/sds  
**Reference Figma file:** linked as 'Figma Community File' in SDS README: https://github.com/figma/sds#resources  
**Reference Storybook:** linked from SDS README.  
**Code Connect docs:** https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/  
**CLI guide:** https://developers.figma.com/docs/code-connect/quickstart-guide/

### Non-negotiable rules

1. Reuse the official `figma/sds` repository, existing React components, existing Figma components, existing `.figma.*` mappings, and Storybook. Do **not** rebuild the component library, switch frameworks, or introduce shadcn/Tailwind if SDS doesn't already use them.
2. Work in a separate fork/private test repository or independent working clone/branches. Never alter the upstream project. Use a single duplicated SDS Figma file if available; do not create one Figma file per test.
3. Keep runs isolated: fresh agent conversation/context and clean worktree for each condition. Reset to the same pinned git commit, with only the intentionally varied factor changed. Do not merge run implementations back into the shared baseline.
4. Treat experiment conditions as real only if the relevant resource was actually available to the agent. Label each run `REAL`, `CODE-ONLY`, `BLOCKED`, or `NOT RUN`. Record available tools and effective permissions.
5. Do not commit credentials, print tokens to logs, request broad scopes unnecessarily, alter paid/account settings, or publish to production. Use secret storage if auth is needed.
6. No paid service enrollment, upgrades, large parallel job launches, public posts, or destructive operations. Apply a conservative preauthorized spending limit supplied by the owner; if none is supplied, use free/available infrastructure only, with a hard limit of 3 attempts per experiment condition.
7. Do not modify Figma design-system master components except for an explicitly isolated description-only treatment on a duplicated file, and only with authorized write access. Preserve before/after descriptions and node IDs. Never modify original upstream/community artifacts.
8. Capture evidence (tool-call transcript or structured trace where available, commit hashes, diffs, test outputs, source file references, screenshots when possible). Do not fabricate numbers. Distinguish measured data from judgment.
9. Create a report even if permissions block a majority of runs. Explain exactly which permissions or actions would unblock them.
10. Stop repeated retries after 2 authentication failures or 3 technical retries per step. Record the blocker and move to a feasible next experiment.

## Expected deliverables

Place in `experiments/` inside the experiment repo (or provide an artifact bundle when repo writes are unavailable):

- `README.md`: environment, pinned source commit, Figma file URL if duplicated, setup, limitations and commands to reproduce.
- `matrix.csv`: each experiment/condition, state (`REAL`/`CODE-ONLY`/`BLOCKED`/`NOT RUN`), unique run ID, seed if supported, component reuse, correct variants, inventions, corrections, total tokens if available, tool calls if available, duration if available, validations and notes.
- `results.md`: analysis by experiment, observations with evidence links, confounds, and 3 prioritized conclusions.
- `traces/`: tool activity or normalized logs showing what context was retrieved, when, and how decisions changed.
- `diffs/` or per-run branches: generated implementation changes.
- `screenshots/` when a browser/rendering environment exists, or a plainly labeled explanation that screenshots couldn't be captured.
- `next-steps.md`: smallest follow-up tests needed to resolve uncertainty.

Never present empty or unavailable metrics as zero. Use `N/A`.

## Phase 0 — Inventory and access checks (start here)

1. Clone/fork https://github.com/figma/sds using available GitHub integration or cloud git environment. Record git commit SHA; do not assume main stays fixed.
2. Inspect README, `package.json`, `figma.config.json`, `src/ui/primitives`, `src/ui/compositions`, `src/figma`, and `src/stories`. Record exact scripts and available components; avoid guessing APIs.
3. `npm ci` (or the repo's supported lockfile install), then run baseline checks and build. Use scripts discovered in package.json; `npm run app:dev` and `npm run storybook` are documented, but check exact build/lint scripts.
4. Discover whether remote Figma MCP is connected, whether search/design-context tools work, and whether Code Connect mappings are readable on the chosen file. A Figma integration being installed is not proof all tools, plans, or scopes are available.
5. If authenticated and allowed, duplicate the SDS Community file exactly once into the owner's sandbox/drafts; record file key and Figma URL. Update only file-key substitutions in `figma.config.json` if node IDs are preserved. Do not publish Code Connect until correct scope and approval are available. Publishing changes remote state and must be authorized.
6. Inspect live Code Connect coverage. If mappings are missing, distinguish `existing templates in repository` from `published accessible Figma Code Connect data`.
7. If no Figma read access, proceed with real code-only experiments against SDS components and metadata. Never claim they test live Figma MCP.

## Common task fixture (single app, minimal code)

Use ONE small page to make the conditions comparable: a **Team Settings Dashboard** with page heading, account/profile details, notification toggles, team-member list/rows, role controls, save/cancel actions, validation feedback, and responsive mobile behavior. Implement it in the existing SDS demo app entry point or one small additive test fixture route; keep under approximately 200 lines of new page code where feasible (not a rigid limit), reuse SDS primitives and compositions; no backend or authentication. Use local static data only.

Where necessary, create *one* matching Figma frame in the duplicated SDS file, assembled exclusively from existing SDS instances. If no write capability exists, use an already existing SDS reference composition/frame for frame-based tests, and separately run text-only tasks; record that exact same-design equivalence was not achieved.

### Requirements for every generated page

- Accessible labels, semantic headings, focus states, keyboard accessibility, realistic disabled/error cases.
- Use existing SDS components/tokens wherever available; don't invent new primitive components merely to improve aesthetics.
- Implement same feature brief across conditions; keep CSS/markup additions minimal.
- For visually judged accuracy, compare like with like: a matching Figma frame is required; otherwise rate system consistency, not pixel fidelity.

## Phase 1 — Primary controlled experiments (highest priority)

Each run must start from the same pinned baseline with isolated context. Prefer 2–3 repetitions per condition if time/cost permits. Prioritize full A/B comparisons before adding more variations.

| ID | Hypothesis | Control | Treatment | What to measure |
| --- | --- | --- | --- | --- |
| E01 | Text-only agent can discover/use design system without mockup | Text prompt with repo, no Figma guidance | Same prompt + explicit instruction to search design-system references | retrieval calls, SDS component reuse, invented primitives |
| E02 | Figma design context helps | Text-only brief with codebase | Matching Figma frame + Figma MCP (if accessible) | design fidelity and correct component choices; note fixture equivalence |
| E03 | Code Connect reduces reinvention | Frame + Figma context without Code Connect details exposed | Same frame + actual Code Connect integration | correct imports/props, invented components, correction loops |
| E04 | Descriptions convey semantic use | Existing component descriptions | Revised *description-only* guidance in a separate copy / isolated authorized treatment | correct selection among semantically overlapping options |
| E05 | Targeted retrieval outperforms full context dump | Agent receives all available component docs at outset | Agent searches/retrieves only relevant components | tool calls, prompt tokens, correctness, latency |
| E06 | Validation reduces violations | Generation without corrective loop | Same generation + one lint/types/accessibility/visual validation and repair loop | violations, correction count, total tokens and time |

**Method caveats:** E03 requires genuine ability to toggle Code Connect context while preserving everything else. If that is impossible, say `BLOCKED` instead of using pretend context. E04 requires controlled description access; if only repo metadata can be changed, call the test `repository-description proxy`, not `Figma component-description test`.

## Phase 2 — Decision-quality tests (as time/access allow)

Use the same fixture plus small targeted prompts, avoiding new screens/design files.

- **E07 Variant correctness:** require destructive vs secondary action, disabled button, controlled checkbox, error and help text; inspect props/ARIA states.
- **E08 Composition:** ask for a settings section composed from existing inputs/layout; assess nesting and reuse.
- **E09 Abstraction boundary:** ask for a repeated team-member row and see if the agent extracts a local composition rather than creating a new design-system primitive.
- **E10 Ambiguity:** omit mobile layout and one error state; assess evidence-based inference, not silent guessing.
- **E11 Conflict:** in an isolated test branch only, make a repository example intentionally stale relative to the component TypeScript API; check whether agent detects and resolves safely.
- **E12 Instructions placement:** compare equivalent usage guidance in agent instructions vs repository docs vs Code Connect/Figma descriptions when live sources are accessible.
- **E13 Minimal instructions versus dedicated skill:** give same brief with minimal instruction vs concise design-system-specific skill.
- **E14 Reactive guardrails:** compare detailed prose rules vs lint/type checks and their feedback loops; do not add a whole custom ESLint plugin for a one-night test.
- **E15 Comprehensive validation:** typecheck, lint, build, keyboard/accessibility spot checks and visual screenshots; identify remaining defects.

## Experiment isolation and validity

- Record which agent/model/version/temperature if exposed, tool configuration, available files and initial instruction context for every run.
- Each factor change should be intentionally restricted: same implementation spec, pinned baseline, task and scoring rubric.
- Use independent branches/worktrees named `experiment/E01-control-r1`, etc.; if repeated runs are costly, prioritize a single matched pair per hypothesis rather than 15 shallow demos.
- Source code inspection before prompting can itself be context injection. Specify whether discovery is allowed; record tool call chronology.
- For Code Connect comparisons, check actual mappings via MCP; a checked-in `.figma.tsx` file is not equivalent to MCP serving Code Connect snippets.
- For Figma descriptions, test whether they appear in retrieved response; content never retrieved cannot have caused performance differences.
- Keep screenshots consistent in viewport, browser, system state. Capture source and resulting page when possible.

## Scoring rubric

**Objective metrics:**

- Approved component reuse = number of eligible instances using matching SDS primitives / total eligible UI instances. Define eligibility manually in rubric first; exclude plain semantic HTML without SDS equivalents.
- Invented design-system components = count of new primitive-style abstractions duplicating SDS features, excluding legitimate local feature compositions.
- Correct component/variant selection = number correct / opportunities identified in test fixture.
- Validation errors = count of relevant TypeScript/build/lint/a11y failures after one fixed repair budget.
- Correction loops = number of agent repairs after initial implementation.
- Retrieval = number of Figma MCP calls, Code Connect snippets surfaced, repository searches, and documents read when exposed.
- Cost = input/output tokens if available, otherwise `N/A` (do not estimate precisely from message length).
- Duration = wall time if observable; otherwise `N/A`.

**Subjective 1–5 ratings (with concrete evidence):** functional completeness, visual/system consistency, semantic/a11y quality, and maintainability. Where Figma fixture absent, pixel fidelity = N/A.

**Never equate more tool calls with worse performance when correctness substantially differs.** Report quality-versus-cost trade-offs.

## Stop rules and overnight prioritization

1. Complete setup and at least one verified runnable baseline first.
2. Target E01, E03 (if enabled), E04 (if enabled), E06. Add E02/E05 when access permits.
3. If Figma auth requires human action, do not keep retrying; complete E01, E06, E07, E08 and E13 code-only, and report the blocked live tests.
4. If no cloud git write access, create a patch/artifact bundle with runnable repo commands, report, and traces; do not claim pushed commits or PRs.
5. After the primary comparisons, use remaining compute for repetitions before testing additional hypotheses.
6. Wrap up with a concise executive summary and artifacts. Any incomplete test must be explicit, with the exact reason.

## Morning report format

1. **Summary:** experiments completed / blocked, single biggest observed improvement and its confidence level.
2. **Links:** experiment repo/branch/PR, duplicated Figma file (if any), Storybook or preview (if available), screenshots and report.
3. **Results matrix:** direct links to evidence for each condition and run.
4. **3 findings:** what improved, what got worse, where evidence was ambiguous.
5. **Invalid comparisons:** clearly explain any uncontrolled variables or inability to isolate features.
6. **Next experiments:** 2–3 specific high-value tests instead of blanket recommendations.

## Launch instruction (paste into a cloud agent)

> Execute the instructions in this handoff end to end using your cloud environment, authenticated GitHub/Figma connections where available, and the official Figma SDS repository. You have permission to create an isolated test repository, experiment branches, local application fixture, results, and screenshots. Do not change existing personal projects or public upstream libraries. Do not make paid purchases or publish Code Connect without separate prior authorization. Prefer valid, measured paired tests over maximum test count. If a tool or permission is unavailable, continue with valid code-only experiments, mark inaccessible tests blocked, and deliver a full morning report with reproducible evidence. Do not claim background scheduling or completion beyond what this agent execution actually supports.

## Setup requirements / owner actions

- **Cloud coding-agent execution:** Launch this as an actual cloud task (e.g., ChatGPT Work with cloud computer, or another cloud coding agent that can run multi-step jobs without an open laptop). Merely attaching the handoff in a normal chat does not launch an autonomous overnight job.
- **GitHub:** Authenticated access with permission to create a sandbox repository or fork and push branches, or explicitly choose artifact-only output.
- **Figma:** Authenticated MCP with read access to a *duplicated* SDS Community file. A Dev/Full seat on an eligible paid plan is needed for certain Code Connect features; scope requirements vary by task. Figma write rights are needed to change descriptions/create one frame; Code Connect publishing additionally requires its write scope and explicit authorization.
- **Compute budget:** Set preferred maximum spending or authorize free-tier resources only. Suggested default: no new paid services.
- **Output destination:** GitHub test repository or downloadable bundle. Preview hosting is optional, not required.

## Verified external references

- Official SDS source and setup: https://github.com/figma/sds
- Official Figma Code Connect overview: https://developers.figma.com/docs/code-connect/
- Official Code Connect MCP integration: https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/
- Official Figma MCP tools: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/
- Official Code Connect quickstart and Figma community file link: https://developers.figma.com/docs/code-connect/quickstart-guide/
