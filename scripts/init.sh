#!/bin/bash
REPOSITORY=/home/ubuntu/api-server

cd $REPOSITORY
sudo pm2 kill
rm -rf *