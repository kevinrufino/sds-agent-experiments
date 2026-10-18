#!/bin/bash
# usage: process_run.sh RUN_ID   (identical post-hoc evidence capture for every run)
S=/tmp/claude-0/-home-user-sds-agent-experiments/cbd70087-78b0-57e7-90af-7738bbc36e01/scratchpad; H=$S/harness
RUN=$1; WT=/home/user/runs/$RUN; OUT=$S/results/$RUN; mkdir -p $OUT
AID=$(awk -v r=$RUN '$1==r{print $2}' $S/runs.tsv)
JSONL=/root/.claude/projects/-home-user-sds-agent-experiments/cbd70087-78b0-57e7-90af-7738bbc36e01/subagents/agent-$AID.jsonl
cd $WT
git add -A -N . ; git diff HEAD > $OUT/diff.patch; git reset -q
node $H/score.mjs $WT > $OUT/score.json
bash $H/validate.sh $RUN $OUT > $OUT/validate.txt 2>&1
python3 -I $H/trace.py $JSONL $OUT/trace.md $OUT/trace.json > $OUT/trace_summary.json
# final hand-back text
python3 -I -c "
import json,sys
last=''
for l in open(sys.argv[1]):
    d=json.loads(l)
    if d.get('type')!='assistant': continue
    for c in d['message'].get('content',[]) or []:
        if c.get('type')=='tool_use' and c.get('name')=='SubagentHandback': last=json.dumps(c.get('input'),indent=1)
        elif c.get('type')=='text' and c.get('text','').strip(): last=c['text']
print(last)" $JSONL > $OUT/agent_report.md
if grep -q "vite_build=pass" $OUT/validate.txt; then node $H/shoot.cjs /home/user/runs/_dist/$RUN $OUT/shot > $OUT/shoot.txt 2>&1; fi
git add -A && git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "experiment($RUN): agent-generated Team Settings page

Unmodified output of an isolated agent run for condition $RUN.
Baseline 05525f7.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Sv5hevmP8aEfzHRbwiqEda"
echo "== $RUN $(git rev-parse --short HEAD)"; tail -1 $OUT/validate.txt; cat $OUT/trace_summary.json; cat $OUT/shoot.txt 2>/dev/null; python3 -c "import json;d=json.load(open('$OUT/score.json'));print(d['reuse_score'],d['raw'],'dangerOnButton',d['danger_variant_on_Button'],'rac',d['rac_imports'],'local',d['local_components'],d['css'],'loc',d['loc_tsx'],d['loc_css']);print([k for k,v in d['rubric'].items() if not v])"
