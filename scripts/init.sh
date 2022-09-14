#!/bin/bash
REPOSITORY=/home/ubuntu/api-server

cd $REPOSITORY
sudo /usr/bin/pm2 kill
rm -rf * !(.evn*)