var fs = require('fs')
  , util = require('util')
  , sessions = require('cookie-sessions')
  , twitter = require('ntwitter')
  , pl = require('../lib/pl.js')
  , bot = require('../scripts/bots.js').tvbot

// twitter client  https://github.com/AvianFlu/ntwitter
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

function iosock() {
  var connections = [];
  function sock() {
 
  }

  sock.connect = function(){
    connections = []
    try {
      // hook up to socket.io
      io.sockets.on('connection', function (socket) {
        // add to connections
        connections.push(socket)
        try{
          //socket.emit('events', { event:"hello", text: 'hello world' });
        }catch(e){
          util.log(e)
        }
        socket.on('disconnect', function () {
          // TODO, remove this from connections!
          //connections = connections.filter(function(s){return s === socket})
        });
      });
    } catch(e){
      util.log(e)
    }
    return sock
  }
  sock.emit = function (name, msg) {
    connections.forEach(function(socket){
      util.log("about to send msg to browser?" + name)
      socket.emit(name,msg);
    })
  }
  return sock
}

//global iosocket
iosocket = iosock().connect()


/*
https://github.com/AvianFlu/ntwitter
TODO:  
  - send tweet stream messages one at a time (instead of resending entire list)
  - allow hubot messages "twstream beer" to add new searches to tweet stream


*/
var pieTwData = [];
function twitterConn(){
  var streamConnected = false
    , strm = null
  function conn() {

  }
  conn.close = function() {
    try {
      if (strm) {
        strm.destroySilent()
      }
    } catch(e){
      util.log(e)
    }
    return conn
  }
  conn.connect = function() {
    conn.close()
    util.log('restarting twitter connection')
    try {
      // this is a one time search for history of piepdx data
      twit.search(config.track, {}, function(err, data) {
        if (data.results) {
          pieTwData = data.results
        }
        if (err) {
          util.log(err)
        }
      });

      // twitter stream
      twit.stream('statuses/filter', {'track':config.track}, function(stream) {
        strm = stream
        streamConnected = true
        stream.on('data', function (data) {
          //console.log(data)
          //console.log("after data")
          //console.log(pieTwData)
          util.log("found tweet: ")
          try{
            //if (pieTwData.length > 9) {
            //  pieTwData = pieTwData.slice(0,9)
            //}
            //pieTwData = [data].concat(pieTwData)
            iosocket.emit('events', { event:"tweet", data:[data] })
          }catch(e){
            console.log(e)
          }
         
        });
        stream.on('end', function (response) {
          // Handle a disconnection
          streamConnected = false
        });
        stream.on('destroy', function (response) {
          // Handle a 'silent' disconnection from Twitter, no end/error event fired
          streamConnected = false
        });
      });
    } catch(e){
      util.log(e)
    }
    return conn
  }
  return conn
}

twconn = twitterConn().connect()


bot.send(function(data){
  util.log("in send for bot->iosocket")
  util.log(util.inspect(data))
  iosocket.emit('events', { event:"irc", data:[data] })
})

app.get('/api/tweets', mw, function(req, res) {
  res.contentType('application/json');
  res.send(pieTwData);
});
// 
app.post('/api/internal/restart', mw, function(req, res) {
  //var n = req.param("name")
  // Restart the socket.io connection in case it drops
  iosocket.connect()
  twconn.connect()
  res.send("restarted?");
});
app.post('/api/message', mw, function(req, res) {
  //util.log(req.body.m)
  var m = req.body.m
  //util.log(config.botname)
  //util.log(m.indexOf("tvbot"))
  if (m.indexOf(config.botname+" ") == 0) {
    m = m.substring(config.botname.length + 1)
    util.log("found bot message '" + m + "'")
    bot.msg("frombot", m)
  } else {
    util.log("not found")
  }
  res.send("ok");
});

app.post('/api/internal/update', mw, function(req, res) {
  iosocket.emit('events', { event:"update", data:[] })
  res.send("ok");
});

app.get('/schedule', mw, function(req, res) {
  //res.render("dash", pl.extend(req.context,{}) );
  util.log(util.inspect(req.context))
  res.render("schedule", req.context);
});

app.get('/', mw, function(req, res) {
  //res.render("dash", pl.extend(req.context,{}) );
  util.log(util.inspect(req.context))
  res.render("stream", req.context);
});


