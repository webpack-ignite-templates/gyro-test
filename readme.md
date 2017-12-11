# Webpack Ignite Test Template

#### Table of Contents

1. Environment Setup
2. Development Directions
3. Build Directions

## 1. Environment Setup

Open a terminal / console in the location where you checked out the code, for ease we will call this the 'project root'.

* run `git init` 

This will create a fresh repository that will eventually be linked up to the gyro source control system

#### Install NPM Packages

* run `yarn install` or `npm install` from the console in the root of the project

## 2. Configuration

#### Config files 

Most of the configuration files are in the `.ignite` folder. The project defaults are generally good for prototyping or even most small websites. If you need to edit the defaults you should open `config.js` and edit the values contained in that file:

## 3. Start Developing!!

#### Setup Entry Pages / Templates
Edit the `config/entries.js` file to contain the pages you need to create. Follow the directions contained in that file, talk to Matt with any questions about this file

#### Setup JS Files for each entry

#### Start webpack

* `npm run start`

#### Edit HTML and CSS


## 4. Production Build Directions

For a production build run `npm run build`. The results of the build will be in the `build` folder and can be zipped and sent to the client
