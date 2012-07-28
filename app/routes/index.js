var fs = require('fs')
  , util = require('util')
  , sessions = require('cookie-sessions');

app.get('/', function(req, res) {
  res.render("dash", {} );
});