#!/bin/bash

#Install curl
sudo apt-get install curl

#Install Node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

#Install build tools
sudo apt-get install -y build-essential

#Install npm 
sudo apt install npm

#Download and install node modules
npm install

#Import the public key used by the package managemenet system for MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

#Create a list file for MongoDB. Assumes Ubuntu 16.04
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

#Reload local package database
sudo apt-get update

#Install the latest stable version of MongoDB
sudo apt-get install -y mongodb-org

#upload.sh command dependencies

#Install jq
sudo apt install jq


#finished
echo "Please run npm start to start server"
echo "please run sudo service mongod start to start mongoDB"
