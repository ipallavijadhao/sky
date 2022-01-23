# SKY

This repository contains basic implementation of 4 given scenarios which validates couple of pages. This has been implemented using npm, javascript, selenium and couple of basic npm packages

## Prerequisites 

You would need node/npm installed on your system. Your system would also need support for one of browse, here we are using chrome. Please refer here - https://nodejs.org/en/download/ to find out instruction to install node

Once node is installed you can check using commands:

- node -v
- npm -v

This repo and functionality has been valiadated using node V12.0.0 and npm 6.5.0

Once node and npm setup is validated, please checkout this repository and navigate within root directory and execute 'npm install' command. This command will install all required npm packages.

## How to run test

We have defined scenarios within 2 different feature file and added reference to them as test1 and test2 within package.json. Based on which scneario you want to validate you can execute following command,

- npm run test1
- npm run test2
