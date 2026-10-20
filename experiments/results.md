# Results: SDS agent experiments

**Outcome: code-only experiments completed and [draft PR #2](https://github.com/kevinrufino/sds-agent-experiments/pull/2) opened; live Figma comparisons remain blocked.** Three fresh generations and one repair produced four isolated artifacts. E01 and E13 share one control; E06 is a before/after comparison on that same control, not independent replication. The delivered Team Settings page passes app/Storybook builds, focused lint, 15 browser checks, and a separate saved-snapshot audit. No production deployment or Figma write occurred.

The strongest observed improvement was compiler-guided repair: **nine TypeScript diagnostics → zero after five import-path changes**, with browser checks remaining 15/15. This is directly measured for one artifact; it is not an estimate of population-level agent performance. The post-hoc audit also shows that passing those checks did not establish correct Save semantics.

## Environment and baseline

Source: `kevinrufino/sds-agent-experiments`, provided fork of official Figma SDS. Source HEAD `05525f75192a3aa5d5690c5e41277ebd19d2efe1`; fixed baseline `8b2b72202ad2c60a591e83128b2f9ad5aa27c162`. Node 24.19.0/npm 11.9.0; frozen `npm ci`; no dependency/lockfile changes. Existing SDS React components, tokens, layout, Storybook, and local data were reused.

The source failed app build with seven TypeScript diagnostics. The shared repair moved prop destructuring into narrowed branches, added the complementary button predicate without changing exported types, and removed an unused Figma binding while retaining its invocation. It preserves existing routing/style omission behavior; it does not redesign the permissive public union type. The third and final permitted baseline repair/build attempt passed. [Baseline patch](diffs/shared-baseline.patch), [build log](traces/baseline-build.log), [environment record](traces/baseline.json).

The runnable/typechecked baseline is **not a repository-wide lint-clean baseline**: full lint has 19 pre-existing errors and 3 warnings, including configuration scope errors and unrelated existing code. [Full baseline lint](traces/baseline-lint.log). Generated App.tsx files were evaluated with the existing lint configuration and pass focused lint; those passes do not erase the full-repository failures.

## Access: verified versus unavailable

User target: [design file, node 3-5](https://www.figma.com/design/mchDCUgpbpnntD9vMBJlzC/Simple-Design-System--Community-?node-id=3-5). The user identifies it as the duplicated experiment file. No connected Figma MCP tools, resource templates, or configured Codex MCP servers were exposed; no FIGMA credential variable names were present. An unauthenticated network probe to `mcp.figma.com` was also denied at CONNECT. No Figma authentication retries, account/billing changes, file edits, frame creation, description edits, or mapping publications occurred. The supplied Professional/Full-seat status was not independently verified and does not establish accessible Code Connect.

The installed CLI successfully parses **383 local checked-in Code Connect mappings**. This measures local template availability only, not published coverage, mapping retrieval, or plan entitlement. [Local parser log](traces/code-connect-local-parse.log), [access record](traces/integration-access.json), [Figma network probe](traces/figma-network-probe.log). All executed runs are CODE-ONLY; none is labeled a Figma integration test. E02/E03/E04 are BLOCKED, including both arms where the matching-frame/toggle/description prerequisite cannot be isolated. No repository-description proxy was run.

Native Git read and experiment-branch push succeeded through the platform HTTPS proxy. GitHub CLI auth status/API checks failed; an unauthenticated probe showed **403 at CONNECT to api.github.com**, so these failures do not establish that the injected credential itself is invalid. Authentication attempts stopped at two; no token values were inspected. The API domain addition is saved in the environment draft, but the tool cannot apply runtime settings or publish. A user authorization reply did not itself change the proxy; the subsequent network probe still failed. On the resumed environment, a new unauthenticated probe returned HTTP 200 and the GitHub API read succeeded. The network state had changed, so the authorized draft PR was created and independently verified as open/draft: [PR #2](https://github.com/kevinrufino/sds-agent-experiments/pull/2). The earlier failures remain recorded as historical access evidence.

## Controlled results

The [rubric](rubric.md), [common brief](prompts/common.txt), and treatment suffixes were written before generation. Each generation used a fresh agent context and clean worktree at the same fixed baseline; no agent saw another run. Same task, permissions, existing AGENTS.md, dependencies, and evaluation scripts. Exact model identifier, temperature, seed, total tokens, and full native tool-call counts were not exposed: **N/A**, not zero. Actual instrumented source retrievals include output, timestamp, byte count, hash, arguments, and status. Agent action summaries are self-reported and are not raw native transcripts.

| Artifact | App build / TS diagnostics | Focused lint | Initial browser checks | SDS controls / variants | Retrieval calls (search/read) | Retrieved bytes | Observed generation/repair seconds |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E01 control | FAIL / 9 | PASS | 15/15 | 10/10; 6/6 | 4 (1/3) | 51,135 | 32.509 |
| E01 explicit search | PASS / 0 | PASS | 15/15 | 10/10; 6/6 | 6 (3/3) | 73,338 | 54.944 |
| E13 concise guidance | FAIL / 1 | PASS | 14/15 | 10/10; 6/6 | 9 (4/5) | 126,054 | 58.837 |
| E06 repaired control | PASS / 0 | PASS | 15/15 | 10/10; 6/6 | 4 (1/3), repair only | 41,335, additional | 24.738, additional |

All four have **zero invented primitives**. Reuse is a manually source-audited count of ten logical interactive instances, excluding hidden native select inputs and structural HTML. Six opportunities cover Save/Cancel variants, disabled invitation, danger action, controlled notification, and associated invalid-email feedback; this deliberately narrow score does not mean every API prop compiles. Duration is the elapsed spawn observation to the action-summary file timestamp, includes tools/waits, and is not pure model latency. Retrieval calls are not total tools or token costs; nonzero retrieval statuses (including partial-output reads of missing paths) are retained in the CSV: 3/1/5/2 respectively.

### E01: ordinary discovery versus explicit search

The only extra instruction in treatment was to search SDS documentation, component APIs, and Storybook before coding. Both arms already had the same repository instructions that recommend API inspection, so this is additional prompting in an instruction-rich repository. The control inspected component source, then used deep imports such as `primitives/Button/Button`. Vite resolves these during development, but tsconfig has only the bare `primitives` alias, causing five missing-module diagnostics and four cascading implicit-any errors. The treatment consulted instructions/stories/APIs and used bare exports, passing compilation.

Treatment spent more measured retrievals/time and did not improve the already-perfect narrow reuse count. One stochastic pair cannot establish that the search instruction caused the outcome. No seed control/repetition was available; data names and layout details were left to agents, so screenshots are system-consistency evidence, not matched visual-fidelity measurements.

Evidence: [control retrievals](traces/E01-control-r1/retrieval.jsonl), [control build](traces/E01-control-r1/build.log), [search retrievals](traces/E01-search-r1/retrieval.jsonl), [search build](traces/E01-search-r1/build.log), [control patch](diffs/E01-control-r1.patch), [search patch](diffs/E01-search-r1.patch).

### E06: identical initial artifact plus one validation repair

A fresh repair agent received the control's recorded compiler/lint/browser feedback, with only App.tsx editable and one repair round allowed. It changed five deep aliases to valid relative component paths, restoring contextual typing. Evaluator reran exactly the same initial checks: build now passes, no compiler diagnostics, focused lint passes, browser checks remain 15/15. No artificial defect was introduced, and no uncontrolled second generation is counted as treatment.

Evidence: [repair-only diff](diffs/E06-repair-only.patch), [repair summary](traces/E06-validated-r1/action-summary.md), [after build](traces/E06-validated-r1/build.log), [after browser](traces/E06-validated-r1/browser.json). The 24.738 seconds and retrieval bytes are **additional repair cost**, not end-to-end totals.

### E13: minimal extra guidance versus concise SDS usage skill proxy

The shared control is E01 control. Treatment receives a local prompt-included guidance block, not an installed skill or Figma-provided context. The guidance points at SDS APIs and a draft/saved state pattern. Treatment retrieved more source, made more path misses, and produced one unsupported `noValidate` prop on SDS Form. Browser removal also leaves focus on BODY, whereas the other pages deliberately move focus to Save/Cancel. It nevertheless correctly implements saved snapshots, which the other arms miss (see audit below).

This is mixed evidence, not evidence that skills generally improve or worsen quality. The guidance is a bundle of instructions, not an isolated component-description change; it cannot answer E04 or E12. Evidence: [guidance](prompts/skill-treatment.txt), [compiler log](traces/E13-skill-r1/build.log), [browser failure](traces/E13-skill-r1/browser.json), [patch](diffs/E13-skill-r1.patch).

### Diagnostics E07/E08/E15 and deferred experiments

E07/E08 reuse and composition were audited on the existing task outputs; these are diagnostic observations, not new independent comparisons. E15 applies compiler/focused-lint/keyboard/error/mobile/screenshot checks to the delivered page. E05, E09, E10, E11, E12, and E14 were NOT RUN as independent conditions. [matrix.csv](matrix.csv) records all 15 IDs, including repeated references to shared artifacts, blocked conditions, and unrun work. Its 21 rows do not represent 21 executions.

## Post-hoc audit and delivery repair

A separate reviewer identified that the initial checks tested Save **feedback**, not persistence of the saved local state. All initial browser scores above remain frozen. The same extra Save → edit → Cancel check was then executed on all four original artifacts:

| Artifact | Restores most recently saved name/email |
| --- | --- |
| E01 control | FAIL: restores original constants |
| E01 explicit search | FAIL: restores original constants |
| E13 concise guidance | PASS: saved/draft snapshots |
| E06 repaired control | FAIL: compiler-only repair preserves original behavior |

These are **post-hoc measurements**, not preregistered primary scores. Evidence is each run's `posthoc.json`, including [search audit](traces/E01-search-r1/posthoc.json) and [skill audit](traces/E13-skill-r1/posthoc.json). This exposes a conflict in the brief: “Cancel restores initial state” did not specify Cancel after a successful Save. Do not infer broad functional completeness from the original 9/9 narrow feature checks.

The delivered `src/App.tsx` starts from E01-search and adds an in-memory saved snapshot; Cancel restores that snapshot. [Delivery-only patch](diffs/final-delivery-repair.patch). This is a post-experiment product repair, not a scored treatment or a merge back into the pinned shared baseline. It passes [final app build](traces/final-build.log), [Storybook build](traces/final-storybook-build.log), [focused lint](traces/final-lint.log), [15 initial browser checks](traces/final/browser.json), and [saved-snapshot audit](traces/final/posthoc.json). Data intentionally lasts for the current app session only; no backend or reload persistence is claimed.

## Screenshots and practical limits

Desktop viewport 1440×1000, mobile 390×844, same system Chromium/device scale. Each original artifact has desktop/mobile/invalid-email/focus images. Final delivery examples:

- [Desktop](screenshots/final-desktop.png)
- [Mobile](screenshots/final-mobile.png)
- [Invalid email](screenshots/final-invalid.png)
- [Keyboard focus](screenshots/final-focus.png)

All initial runs recorded zero JavaScript page exceptions **and 17 resource console errors**. The supplementary network trace identifies denied Google Fonts stylesheet requests; a local request confirms the automatic favicon path returns 404. Initial generic console messages lack request URLs, so the exact attribution of every historical entry cannot be proven. Screenshots use fallback fonts; no pixel fidelity or exact Figma typography claim is made. Fonts domains were added to the saved draft, but access has not been applied/reverified.

Initial focus testing verifies keyboard focus and `:focus-visible`, not appearance. The post-hoc audit additionally measures a real SDS input inset-shadow change from `rgb(217,217,217)` to `rgb(68,68,68)` and captures focus screenshots. This is a spot check, not a complete contrast/WCAG audit. Mobile checks verify rendering and absence of horizontal overflow; they do not establish comprehensive mobile interaction or assistive-technology support. Role selectors are labeled in source/ARIA snapshots; the initial role-change test primarily exercises their state change.

## Three prioritized findings

1. **Use compiler feedback even when the development page works.** The fixed five-import repair eliminates nine diagnostics without changing the 15 browser outcomes. Confidence is high for this specific artifact, low for any general productivity effect.
2. **Audit behavioral semantics beyond success text.** The separate Save→edit→Cancel check catches three failures hidden by the initial suite; the guidance arm does better on this behavior while still failing compilation/focus. Compiler, UI behavior, and accessibility evidence answer different questions.
3. **Do not infer Figma/Code Connect effects from repository templates or account tier.** No live-context comparison ran. Connect authenticated MCP to the designated duplicate and inspect real mapping/description responses before testing E02–E04. One text-only pair or a local parser result cannot support a Figma integration conclusion.

## Delivery status

The isolated run branches and shared baseline are pushed; results are on `experiments/sds-settings-results`. [Draft PR #2](https://github.com/kevinrufino/sds-agent-experiments/pull/2) is open against `main`; its head is `experiments/sds-settings-results`. [GitHub verification](traces/github-pr.json) records the returned state, draft flag, and refs. The [PR description](pr-description.md) summarizes findings and limitations. `install_script`, updated `start_skill`, and custom domain additions are saved in the environment draft; saving neither applies runtime settings nor publishes/restores a new task. Environment publication is pending and fresh-task restoration is untested.
