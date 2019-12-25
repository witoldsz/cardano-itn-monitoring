#!/bin/bash

cd "$(dirname "$0")"
NODE_BIN=$(find . -maxdepth 3 -path '*/bin/node')
NODE_BIN=${NODE_BIN:-node}
LOG_FILE=./log.txt

reboot=$($NODE_BIN ./status-processor.js | tee -a $LOG_FILE | grep REBOOT)

if ! [ -z "$reboot" ]
then
  systemctl restart cardano-testnet.service
fi
