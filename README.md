PiePdx TV Dashboard Project
============================

A http://piepdx.com community project to build out a community bulletin board on the tv's  



Hacking
====================

Fork, Hack, Submit pull request's & Issues (github).   It is deployed to http://appfog.com frequently.

TODO:   https://github.com/piepdx/board/issues

Overall design
------------------

- The app listens to Twitter Stream , and Hubot (IRC).  
   - The twitter stream gets Parsed using http://embed.ly to show images, etc.  
   - Hubot listens for certain messages on IRC and then sends a message
        to browser via Sockets.io
   - Each message type ("showimage", "addevent") has a handler (javascript) on the browser.
        if you want to add your own, please do so.
   
   


Running
======================

Install Node & Npm  and then cd into app folder.   

To view the twitter data, you will need to have a development.json file in your folder that
contains valid twitter oauth credentials::
    
    npm install package.json

    # run && view on http://localhost:3000
    node app.js   

    # or install and run w https://github.com/isaacs/node-supervisor/
    npm install -g supervisor
    supervisor -w app.js,routes,lib  app.js


