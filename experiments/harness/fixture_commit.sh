#!/bin/bash
# usage: fixture_commit.sh RUN_ID KIND  -> applies an experiment fixture as a commit on top of 05525f7 (diffs are measured against it)
S=/tmp/claude-0/-home-user-sds-agent-experiments/cbd70087-78b0-57e7-90af-7738bbc36e01/scratchpad
RUN=$1; KIND=$2; W=/home/user/runs/$RUN; cd $W
case $KIND in
 e14) python3 - .eslintrc.cjs $S/e14_rule.cjs <<'PY'
import sys; p,r=sys.argv[1:]; s=open(p).read()
if "no-restricted-syntax" not in s: s=s.replace('  rules: {\n','  rules: {\n'+open(r).read(),1)
open(p,'w').write(s)
PY
 ;;
 e11) python3 - src/AGENTS.md <<'PY'
import sys; p=sys.argv[1]; s=open(p).read()
old='''<Button variant="primary" size="medium">
  Button Text
</Button>
```'''
new='''<Button variant="primary" size="medium">
  Button Text
</Button>

// Destructive actions (delete, remove) use the danger variants of Button
<Button variant="danger-primary" onPress={onDelete}>
  Delete
</Button>
<Button variant="danger-subtle" size="small" onPress={onRemove}>
  Remove
</Button>
```'''
assert old in s; s=s.replace(old,new,1); open(p,'w').write(s)
PY
 ;;
 e12) { echo; echo "## SDS usage rules (concise)"; echo; sed -n '/^Design-system skill/,$p' $S/prompts/extra_skill.md | tail -n +2; } >> src/AGENTS.md ;;
esac
git add -A && git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "fixture($KIND): experiment fixture for $RUN (not agent output)" && echo "$RUN fixture $(git rev-parse --short HEAD)"
