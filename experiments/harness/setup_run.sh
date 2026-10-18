#!/bin/bash
# usage: setup_run.sh RUN_ID  -> creates clean worktree at pinned baseline
set -e
RUN=$1; BASE=05525f7
REPO=/home/user/sds-agent-experiments; WT=/home/user/runs/$RUN
git -C $REPO worktree add -q -b experiment/$RUN $WT $BASE
ln -s $REPO/node_modules $WT/node_modules
echo "$WT @ $(git -C $WT rev-parse HEAD)"
