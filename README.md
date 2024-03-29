# GHOSTCORDv2

Ghostcord is a chat/messaging web application run on react.js, express.js, firebase, and twilio api. It is a small project that my friends and I had originally developed (link to GHOSTCORD v1.0 at the bottom). Then, I decided to continue building the application and had made several big changes to it, including new UIs, and many new features. 

## Features

* Animations
    * Login/logout
    * Upload files
    * Homepage
    * etc.
* Real-time Chat System
    * Group chat
    * Direct Message
    * Chat Information
    * Sending messages, photos/files, and emojis
* User Status (Online/Offline)
* User Profile
    * Change username/email
    * Change user avatar
* Friend System 
    * Add/remove friend 
    * Direct Message with friends
* Notifications
    * New Messages
    * New friend requests
    * New Group chat invites
* Video Chat
   * *currently does not work properly as twillio api does not allow deployed website to run video chat*
   
Check out the deployed website at [https://test-f53fb.web.app/](https://test-f53fb.web.app/)

## Developer Guide

### Technologies and Software Used:

* Stack: React, Firebase
* Third-party component: Material-UI

### Required Downloads

Node.js, NPM, React

### Setup 

1. First clone the given repo 
2. `cd /GHOSTCORD`
3. `npm install` to install all dependencies used in project
5. `yarn start` or `npm start`
6. from here a browser should pop up and allow you to see website
    - in addition it will make changes and reload automatically
    - to test open console (inspect)

## Previews:
![login page (v3)](https://user-images.githubusercontent.com/44854519/125171256-1039bd80-e168-11eb-895a-f933bd4a3095.png)
![homepage v4](https://user-images.githubusercontent.com/44854519/128401837-cb72e235-de39-43de-acf3-8bce4694f084.png)
![giphy](https://user-images.githubusercontent.com/44854519/125171100-3579fc00-e167-11eb-83f3-cb42ab29d202.gif)
![homepage animation](https://user-images.githubusercontent.com/44854519/125171106-40349100-e167-11eb-9552-85ed6aff4366.gif)
![upload animation](https://user-images.githubusercontent.com/44854519/125171111-4a568f80-e167-11eb-99db-e0a743ae7d29.gif)

## Versions:
    1.0.0: Basic chat system (send messages and photos), add/remove friends, group chat, and
           user profile functionalities added

==> [GITHUB](https://github.com/henrymhong/ghostcord)
    
    2.0.0: UI overhaul on all pages, Direct message, animations, notifications, user status, 
           and chat information functionalities added 
    2.0.1: Emojis added
    2.1: Group chat/direct messages list now show chat preview. UI changes to to new message(s) alert.
    
## Future Features to Be Added
1. Message seen/read
2. Last active
3. Re-integrate video calls using another api
    
