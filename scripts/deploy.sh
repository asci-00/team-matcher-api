#!/bin/bash
REPOSITORY=/home/ubuntu/api-server

cd $REPOSITORY
npm install
sudo pm2 start npm run start
touch text.txt
