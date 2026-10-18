# Next actions

1. **Finish draft PR creation:** In environment settings, save/apply Internet access for `api.github.com` (already added to the draft). The available draft tool only persists configuration; approval in chat does not apply it. Keep the existing injected GitHub identity. After the proxy route changes, retry the API operation and determine whether that identity is authorized; don't assume the earlier CONNECT denial invalidated the token. Respect the two-authentication-attempt cap per meaningful configuration state. Then run from this checkout:

   ```sh
   gh pr create --draft --repo kevinrufino/sds-agent-experiments --base main --head experiments/sds-settings-results --title "Measure SDS discovery and validation with isolated Team Settings experiments" --body-file experiments/pr-description.md
   ```

   If created through Codex, attach the resulting URL to the task. No production deployment is requested. If API access remains unavailable, the pushed results branch and committed patches/reports are the artifact fallback; do not call that an opened PR.

2. **Enable a real E03/E04 pair:** Connect the Figma MCP integration with read access to the user-designated `mchDCUgpbpnntD9vMBJlzC` duplicate, then retrieve node 3-5 and inspect actual Code Connect mapping output plus component descriptions. Record returned file/node identity and coverage. If mappings are unavailable or cannot be toggled while holding other context constant, keep E03 blocked. Description treatment requires isolated authorized write/read access to the duplicate, captured before/after text/node IDs, and proof those descriptions reached the agent. Do not modify upstream artifacts or publish mappings without separate approval. Do not purchase a plan/API upgrade.

3. **Replicate the code-only pairs:** Run 2–3 fresh repetitions of E01 using the same fixed data, layout/task, baseline, permissions and evaluator. Expand the preregistered brief to define Save→edit→Cancel and keyboard focus after deletion. Repeat E06 on naturally failing outputs; do not seed defects to force improvement. Preserve total initial+repair time and retrieval cost separately. Report variability rather than treating this single pair as a general effect.

Optional environment finish: `fonts.googleapis.com` and `fonts.gstatic.com` are saved domain additions for the repository's existing font links. Apply them, verify the fonts actually load, then recapture a clearly separate screenshot set if typography comparisons are needed. Review/save the reusable install/start configuration and publish the environment through its UI when ready; no snapshot publication or fresh-task restoration was verified in this run.
