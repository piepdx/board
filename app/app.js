var express = require('express')
  , util = require('util')
  , fs = require('fs')
  , ejs = require('ejs')
  , sessions = require('cookie-sessions');


config = {
    name:"piepdxb1"
    , secretkey:"25rt56g"
    , twitter : {
      consumerkey:"key"
      , consumersecret:"secret"
      , accesskey:"key"
      , accesssecret:"secret"
    }
}

function loadConfig() {
  var env = process.env.NODE_ENV || 'development'
    , data = fs.readFileSync('./' + env + '.json')
  
  try {
    config = JSON.parse(data);
  } catch (err) {
    console.log('There has been an error parsing your config.JSON.')
    console.log(err);
  }
}

loadConfig()

// global app
app = express.createServer(
    express.logger()
    , express.bodyParser()
    , sessions({secret: config.secretkey})
  )
// global io
io = require('socket.io').listen(app)

//Setup the express web app config/settings:   - views, templating, directories 
app.configure(function(){
  app.use(express.static(__dirname + '/static'));
  app.set('views', __dirname + '/views');
  app.register('html', require('ejs'));
  app.set('view engine', 'html');
  app.enable("jsonp callback");
  app.use(express.cookieParser());
});
// set default layout, combined with above register "html" causes layout.html to be view
app.locals.layout = 'layout';

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// load the route controllers, the whole folder of them...
require('./routes');

app.listen(process.env.VCAP_APP_PORT || 3000);