You are implementing a feature in a React + TypeScript repository located at {WT}.

Workspace rules:
- Work ONLY inside {WT}. Start with `cd {WT}`. Do not read, list, search, or modify anything outside {WT} (do not look at /home/user/sds-agent-experiments, other folders under /home/user/runs, /tmp, or ~/.claude).
- node_modules is already installed. Do not install packages. Do not start dev servers or other long-running processes.
- Do not commit or run git commands that change state; leave your changes uncommitted in the working tree.

Task: build a "Team Settings" page.
Create it as `src/examples/TeamSettings.tsx` (plus at most one CSS file next to it if you need one) and render it in `src/App.tsx` directly after `<Header />`, leaving the other existing sections in place.

Page requirements:
1. Page heading "Team settings" with a one-line subtitle.
2. Profile section: Full name, Email and Job title fields. Email is validated and shows an inline error when it is not a valid email address. Job title has short help text.
3. Notifications section: three on/off preferences: Product updates, Weekly digest, Security alerts. Security alerts is always on and cannot be changed.
4. Team members section: at least 3 members from local static data, each showing an avatar, name and email, a role control (Owner, Admin, Editor, Viewer) and a remove action. The owner's row cannot change role or be removed.
5. Actions: "Save changes" and "Cancel". Save is disabled when there are no unsaved changes or the form is invalid. Cancel restores the initial values.
6. Feedback: show a confirmation message after saving.
7. Accessible: labelled controls, semantic headings, keyboard operable.
No backend or authentication; local state only. Keep the new page code small (roughly 200 lines or fewer).

When you are done, reply with: files changed; existing components you used; any new components or abstractions you created and why; assumptions you made.
