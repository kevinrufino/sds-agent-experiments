# SDS agent experiments — setup, rubric, reproduction

This folder holds the evidence for a set of controlled experiments on how coding agents reuse the Simple Design System (SDS) when building one small page. Start with [`results.md`](results.md) for findings; [`matrix.csv`](matrix.csv) has one row per run.

## Environment

| Item | Value |
| --- | --- |
| Repository | `kevinrufino/sds-agent-experiments` (fork of `figma/sds`) |
| Pinned baseline commit | `05525f75192a3aa5d5690c5e41277ebd19d2efe1` (upstream merge of PR #57). Every run started from this commit. |
| Runtime | Claude Code cloud session (Linux container), Node v22.22.0, npm 10.9.4, Playwright 1.56.1 + Chromium for screenshots |
| Agent under test | Claude Code `general-purpose` sub-agent, fresh context per run, model inherited from the orchestrating session. The model name is not recorded here by policy, and sampling temperature and seed are not exposed (`N/A`). |
| Orchestrator | The same Claude Code session; it built fixtures, launched runs, and scored them. It never edited run output. |
| Figma | Pro plan, Full seat (checked with `whoami`). Duplicated SDS file `mchDCUgpbpnntD9vMBJlzC`. The upstream community file was never used. |
| Figma MCP | The `mcp__Figma__*` connector worked. A second Figma plugin server failed to connect (proxy 403), which had no effect because the connector covered the same tools. |
| Paid services | None used. |

## Baseline health (before any change)

| Check | Command | Result at `05525f7` |
| --- | --- | --- |
| Install | `npm ci` | ok (89 s) |
| Full build script | `npm run app:build` (`tsc && vite build`) | **fails**: 7 pre-existing TypeScript errors (`Button.tsx` ×4, `AnchorOrButton.tsx` ×2, `Tag.figma.ts` ×1) |
| Bundle | `npx vite build` | **passes** |
| Lint | `npm run app:lint` | **fails**: 20 pre-existing problems (17 errors, 3 warnings) in 15 upstream files |

Because upstream is not green, every run is scored on the **delta**: new `tsc` errors (total minus the baseline 7), errors located in files the run changed, ESLint on changed files only, and `vite build` pass/fail. The baseline errors were left in place on purpose; fixing them would have changed the shared starting point.

## Figma access checks (Phase 0)

| Probe | Result |
| --- | --- |
| `whoami` | ok: Pro plan, Full seat, Figma AI allowed |
| `get_metadata` (file) | ok. It lists only the first page, but `use_figma` shows 30 pages, and the component node IDs match the IDs in `figma.config.json`. |
| `get_metadata 4185:3778` (Button set) | ok: 18 variants |
| `search_design_system` (button, switch) | **empty**. The duplicate's components are local to the file, not a published library. |
| `get_code_connect_map` on component set `4185:3778`, variant `4185:3779`, set `9762:1902` | **`{}`**: no Code Connect mappings are published for the duplicate |
| `get_design_context` on `9762:1902` and on the fixture frame | ok. Returns reference code, a screenshot, and a **"Component descriptions"** block. No Code Connect snippets. |

The repo's `src/figma/**/*.figma.ts` templates point at the **upstream** file key `J0KLPKXiONDRssXD1AX9Oi` through `figma.config.json`. A checked-in template is not the same as MCP serving Code Connect, so E03 is **BLOCKED** (see `results.md`).

## Figma artifacts created (duplicate file only)

- One new page, **"Agent Experiment Fixture"** (`3005:2`), holding one frame, **"Team Settings (experiment fixture)"** (`3005:3`): https://www.figma.com/design/mchDCUgpbpnntD9vMBJlzC/Simple-Design-System--Community-?node-id=3005-3
  It contains only instances of existing SDS components: Text Content Title, Notification (Alert), Text Heading ×3, Input Field ×3 (incl. Error state), Switch Field ×3 (incl. Disabled), Avatar Block ×3, Select Field ×3 (incl. Disabled), Button Danger (Subtle/Small) ×3, Button Group with Button Neutral + Button Primary (Disabled). The member rows are plain auto-layout frames, so no new components were made. Screenshot: [`screenshots/figma-fixture-3005-3.png`](screenshots/figma-fixture-3005-3.png).
- **E04 description treatment.** Descriptions on 10 component masters were changed for the E04 runs only, then restored. Before and after values with node IDs are in [`figma/e04_descriptions.json`](figma/e04_descriptions.json). After restoring, every node was read back and matched the original exactly.
- No Code Connect mappings were published or added. `add_code_connect_map` and `send_code_connect_mappings` were never called.

## Common task fixture

One brief, identical in every run, word for word ([`prompts/base.md`](prompts/base.md)): build `src/examples/TeamSettings.tsx` and render it after `<Header />`. The page has a heading, profile fields with email validation and help text, three switches (one locked on), at least 3 member rows with avatar, role control, remove action and a locked owner, Save/Cancel with dirty and invalid logic, page-level error and success feedback, a mobile layout, and accessibility. A short **condition block** is appended per condition ([`prompts/`](prompts/)); it is the only thing that varies.

## Conditions and isolation

| Condition | Appended block | Figma tools | Validation by agent |
| --- | --- | --- | --- |
| `text_only` (shared control) | "Do not use Figma tools" | forbidden | forbidden |
| `search` | + "search this repository's design-system references first" | forbidden | forbidden |
| `validate` | + one `tsc`/`eslint`/`vite build` pass, one repair, one confirming re-run | forbidden | **required** |
| `figma` | + Figma frame URL, "use the Figma MCP tools, read-only" | **used** | forbidden |
| `figma` with E04 descriptions | identical text to `figma`; only the Figma descriptions differ | **used** | forbidden |
| `fulldump` | + "read `DESIGN_SYSTEM_DOCS.md` (all AGENTS.md + all ui/ component source, 4,132 lines) in full; don't open other files except App.tsx" | forbidden | forbidden |
| `skill` | + a concise 12-line SDS usage skill | forbidden | forbidden |

Isolation:
- **Clean start.** Every run got a fresh sub-agent (no shared conversation) and its own `git worktree` on branch `experiment/<RUN>`, created from `05525f7`. `node_modules` was symlinked from the main checkout, which was kept at the baseline commit with no experiment files while runs executed.
- **Out-of-repo harness.** Prompts, harness and scoring scripts lived outside the repository. Agents were told not to read outside their worktree. A scan of every logged tool argument (first 300 characters of each) found no access to the main checkout, other worktrees, `/tmp` or `~/.claude`.
- **Figma ordering.** Runs that needed different Figma states never overlapped: the E02 runs finished before the E04 descriptions were written, and the descriptions were restored before E02-r3 started.
- **Repeat structure.** Runs were launched in parallel within each batch.

## Rubric (fixed before the first run)

**Approved component reuse:** 15 eligible UI opportunities, each counted as met if the matching SDS component is used.

| ID | Opportunity | Counts as correct |
| --- | --- | --- |
| R01 | Page title | `TextContentTitle` / `TextTitlePage` / `TextTitleHero` |
| R02 | Section headings | `TextHeading` / `TextContentHeading` / `TextSubheading` / `Legend` |
| R03 | 3 text inputs | ≥3 `InputField` |
| R04 | Email error | `InputField` `errorMessage` + `isInvalid`/`validate` (no custom error markup) |
| R05 | Help text | `InputField description` |
| R06 | On/off preferences | `SwitchField` (or `CheckboxField`) |
| R07 | Locked preference | `isDisabled` on that field |
| R08 | Member identity | `AvatarBlock` / `Avatar` |
| R09 | Role control | `SelectField` / `RadioGroup` |
| R10 | **Remove (destructive)** | `ButtonDanger` / `DestructiveIconButton`. A plain `Button`/`IconButton` is a wrong variant, because `Button`'s type removes the danger variants on purpose. |
| R11 | Save | `Button` with `isDisabled` logic |
| R12 | Cancel | `Button` variant neutral/subtle |
| R13 | Action grouping | `ButtonGroup` |
| R14 | Page feedback | `Notification` |
| R15 | Layout | `Flex` / `Section` / `Grid` |

**Invented design-system components:** new primitive-style components that duplicate SDS features. Local page compositions such as `MemberRow` or `SettingsSection` are recorded separately as legitimate local abstractions (E09).

**Other metrics:**
- **Raw-HTML substitutes:** counts of `<button>`, `<input>`, `<select>`, `<h1-6>`, `<label>` used where an SDS equivalent exists.
- **Direct imports** from `react-aria-components`.
- **Hard-coded CSS:** hex/rgb colors, px values, and custom flex/grid rules in new CSS.
- **Validation:** new `tsc` errors, ESLint errors in changed files, `vite build`.
- **Correction loops:** the number of agent edits after the first full write, from traces.
- **Retrieval:** tool calls, Figma MCP calls, files and docs read, from traces.
- **Cost:** API token usage summed over the run's assistant messages, split into input, output, cache-read and cache-create. These are measured counts, not estimates.
- **Duration:** wall time from first to last transcript event.

Automated detection is regex-based ([`harness/score.mjs`](harness/score.mjs)). R10, R12 and the remove-action component were also checked by hand for every run (see `results.md`). Subjective 1–5 ratings were not assigned, because nearly all runs cleared the objective rubric and the remaining differences come down to a few named defects (see `results.md`). Pixel-fidelity numbers were not computed: the Figma runs are compared to the fixture by screenshot only.

## Reproduce

```bash
git checkout 05525f7 && npm ci
# one run
bash experiments/harness/setup_run.sh E01-control-r9          # worktree + branch from 05525f7
bash experiments/prompts/make_prompt.sh E01-control-r9 text_only > prompt.md
#   give prompt.md to a fresh agent (Figma conditions also need Figma MCP auth to the duplicate file)
bash experiments/harness/validate.sh E01-control-r9 out/       # tsc/eslint/vite delta vs baseline
node experiments/harness/score.mjs /home/user/runs/E01-control-r9
node experiments/harness/shoot.cjs /home/user/runs/_dist/E01-control-r9 out/shot   # needs Playwright
python3 experiments/harness/trace.py <agent-transcript.jsonl> out/trace.md out/trace.json
```

Paths in the harness scripts are written for this container: `/home/user/runs`, plus a scratchpad path in `process_run.sh`. Edit them before reusing the scripts.
