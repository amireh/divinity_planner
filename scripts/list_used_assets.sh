#!/usr/bin/env bash

egrep --color -rno '(images|assets)\/(.+\/?)+\s?' ui --exclude-dir=database