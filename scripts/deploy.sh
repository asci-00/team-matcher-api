#!/bin/bash
cd /home/ubuntu/api-server
/usr/bin/npm install
/usr/bin/pm2 start npm -- start >> log
