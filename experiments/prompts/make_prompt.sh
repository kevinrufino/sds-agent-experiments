#!/bin/bash
# usage: make_prompt.sh RUN_ID COND [extra_file] [base_file]
D=$(dirname $0); RUN=$1; COND=$2; EXTRA=$3; BASE=${4:-$D/base.md}
{ sed "s#{WT}#/home/user/runs/$RUN#g" $BASE; [ -f $D/cond_$COND.md ] && cat $D/cond_$COND.md; [ -n "$EXTRA" ] && [ -f "$EXTRA" ] && cat $EXTRA; }
