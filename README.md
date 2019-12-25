- Requires _Node.js_:
  - installed on PATH
  - or download from https://nodejs.org (tested with 13.5.0) and unpack here, the script will search for binary using `find`

- schedule on crontab:
  - `crontab -e`
    ```
    * * * * * /root/cardano-itn-monitoring/runner.sh
    ```
    
- the `runner.sh` script assumes that the reboot command is `systemctl restart cardano-testnet.service` (_Systemd service_) and directs it's own the logs into the `./log.txt` file.


Have FUN: clone, star, fork the project :D
