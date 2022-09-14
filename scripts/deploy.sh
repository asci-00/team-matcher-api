#!/bin/bash
REPOSITORY=/home/ubuntu/api-server

cd $REPOSITORY
npm install
sudo /usr/bin/pm2 start npm -- start >> log
