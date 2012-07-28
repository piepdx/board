var fs = require('fs')
  , util = require('util')
  , sessions = require('cookie-sessions')
  , twitter = require('ntwitter')
  , pl = require('../lib/pl.js')


// twitter client
var twit = new twitter({
  consumer_key: config.twitter.consumerkey,
  consumer_secret: config.twitter.consumersecret,
  access_token_key: config.twitter.accesskey,
  access_token_secret: config.twitter.accesssecret
});;


// the web context
function WebContext(req){
  //util.log(util.inspect(req))
  var roles, self = this;
  this.iourl =    "http://" + req.headers.host
  this.title =       "Pie Dashboard"
}

/**
 * Modules/Filters/Middleware for routes below   
*/
function mw(req,res,next){
  if (!("context" in req)){
    req.context = new WebContext(req)
  }
  next()
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


var pieTwData = [];

twit.search('piepdx', {}, function(err, data) {
  //console.log(data);
  pieTwData = data
});


app.get('/api/tweets', mw, function(req, res) {
  res.contentType('application/json');
  res.send(pieTwData);
});

app.get('/', mw, function(req, res) {
  //res.render("dash", pl.extend(req.context,{}) );
  util.log(util.inspect(req.context))
  res.render("dash", req.context);
});