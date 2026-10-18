# SDS agent experiments

Executed in Codex Cloud using the existing `kevinrufino/sds-agent-experiments` fork. No paid service enrollment, Figma writes, Code Connect publishing, or production deployment occurred. The uploaded handoff is preserved in [HANDOFF.md](HANDOFF.md); direct user instructions govern execution and authorization.

Start with [results.md](results.md), [matrix.csv](matrix.csv), [rubric.md](rubric.md), and [next-steps.md](next-steps.md). `traces/` contains actual retrieval outputs, evaluations, and self-reported agent summaries clearly separated. `diffs/` contains the shared baseline fix, each full page patch, the E06 repair-only patch, and the final delivery-only snapshot repair. `screenshots/` contains desktop, mobile, and invalid-email states for all four evaluated artifacts.

## Pinned environment

- Fork source commit: `05525f75192a3aa5d5690c5e41277ebd19d2efe1`.
- Repaired shared baseline: `8b2b72202ad2c60a591e83128b2f9ad5aa27c162`, branch `experiment/shared-baseline`. All generation arms start here; it remains unchanged.
- Node 24.19.0, npm 11.9.0; `npm ci --no-audit --no-fund --cache /workspace/.npm`, lockfile unchanged.
- Existing React/Vite/SDS components and Storybook; local mock data; no application credentials or backend.
- User-supplied experiment file: https://www.figma.com/design/mchDCUgpbpnntD9vMBJlzC/Simple-Design-System--Community-?node-id=3-5 . Its duplicated-file identity cannot be independently verified without Figma access. The file was not read or modified.
- User-reported Professional plan/Full seat is not evidence of accessible MCP or published mappings. No Figma MCP tools/configured servers are available. Local Code Connect CLI parses 383 checked-in mappings; live coverage is unverified.
- Git read/push works via platform HTTPS proxy. `api.github.com` is denied at CONNECT; draft PR creation requires that runtime network change. No token values are recorded.

## Run the selected Team Settings fixture

Each Cloud task is already isolated. Use the existing checkout; do not create extra worktrees for normal development. Worktrees below are specifically authorized experiment isolation.

```sh
cd /workspace/sds-agent-experiments
npm ci --no-audit --no-fund --cache /workspace/.npm
npm run app:dev -- --host 0.0.0.0 --strictPort
# Separate terminal, same directory:
STORYBOOK_DISABLE_TELEMETRY=1 npm run storybook -- --host 0.0.0.0 --ci
```

Use local HTTP requests to verify ports 8000 and 6006; no production hosting or browser preview link is required. The results branch's `src/App.tsx` uses the passing E01-search page plus the separately documented saved-snapshot repair, added after evaluation. No conditions use this promoted state as their baseline.

Run the build commands separately: the repository's combined `npm run build` uses `;` and could conceal an app-build failure.

```sh
npm run app:build
STORYBOOK_DISABLE_TELEMETRY=1 npm run storybook:build
./node_modules/.bin/eslint src/App.tsx --max-warnings 0
node experiments/scripts/browser.mjs final http://127.0.0.1:8000/
```

The provided Cloud image supplies `/usr/bin/chromium` and `/opt/codex/cua_node/lib/node_modules/playwright-core/index.mjs`. The browser evaluator depends on those paths; elsewhere install a compatible Playwright/Chromium into a separate tooling environment and update the evaluator import/executable paths. This is tooling, not an app dependency.

Storybook needs a readable standard `~/.storybook/settings.json`. Setup initialized it with `{version:1,userSince:<creation timestamp>}` only when missing. Do not replace existing settings or change HOME; use supported filesystem approval if creating this standard file is blocked by a sandbox.

## Reproduce existing outputs and evaluate them

The comparison branches are independent; do not reset or overwrite existing worktrees. On a fresh checkout, create clean directories at the following paths from the pinned commits and reuse the locked dependencies:

```sh
git fetch origin
git worktree add /workspace/sds-runs/E01-control-r1 f250f51
git worktree add /workspace/sds-runs/E01-search-r1 fa7945a
git worktree add /workspace/sds-runs/E13-skill-r1 3a0dd38
git worktree add /workspace/sds-runs/E06-validated-r1 63ef6ca
```

Run `npm ci --no-audit --no-fund` in each worktree, or link its ignored `node_modules` to the main checkout's identical install as done here. The evaluator writes new logs/screenshots under the corresponding run IDs: preserve captured evidence first or use a separate copy of this repository.

```sh
python experiments/scripts/evaluate.py E01-control-r1 --port 8101 # Expected compiler failure
python experiments/scripts/evaluate.py E01-search-r1 --port 8102
python experiments/scripts/evaluate.py E13-skill-r1 --port 8103 # Expected compiler/focus failure
python experiments/scripts/evaluate.py E06-validated-r1 --port 8104
python experiments/scripts/summarize.py
```

`evaluate.py` records each underlying exit status and now returns failure if any required command/check fails. The initial pre-repair evaluations used a wrapper that returned zero after writing the JSON summary even if a subcommand failed; all reported outcomes use the captured subcommand statuses and browser assertions, never that wrapper exit code.

To run new generations, use fresh agent contexts at `8b2b722` with [common.txt](prompts/common.txt) and exactly one intentional treatment suffix. Read source through `scripts/retrieve.py --evidence <run-trace-directory> read <paths...>` or `search <pattern> <paths...>`. Keep prompt, permissions, evaluation and repair budget constant. This is a procedure for new runs, not a claim those repetitions occurred. Seeds, exact model identifier, token counts, and full native tool transcripts were not exposed.
