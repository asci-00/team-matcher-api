#!/bin/bash
REPOSITORY=/home/ubuntu/api-server

cd $REPOSITORY
/usr/bin/pm2 kill
rm -rf *
