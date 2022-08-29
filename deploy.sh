#!/bin/bash
network=${1:-"httest"}

if [ ! -e "./.secret" ]
then
  echo "You must set DEPLOY_PRIVATE_KEY and NAME_SIGNER_KEY in .secret file"
  exit
fi    

if [ -e ".env" ]
then
  cp .env .env_bak
  rm -rf .env  
fi

cat .secret >> .env
echo "" >> .env
cat "./config/$network.cfg" >> .env

npx hardhat run scripts/deploy/deployAll.js --network $network
rm -rf .env
