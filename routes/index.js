var fs = require('fs')
  , util = require('util')
  , sessions = require('cookie-sessions')
  , twitter = require('ntwitter')
  , pl = require('../lib/pl.js')


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

connections = [];
try {
  // hook up to socket.io
  io.sockets.on('connection', function (socket) {
    // add to connections
    connections.push(socket)
    try{
      //socket.emit('events', { event:"hello", text: 'hello world' });
    }catch(e){
      console.log(e)
    }
    socket.on('disconnect', function () {
      // TODO, remove this from connections!
    });
  });
} catch(e){
  console.log(e)
}
/*
TODO:  connect and listen to HUBOT and send messages to browser
    HUBOT to get hooked up to our IRC

hubot.on("msg",function(data){
  
  if (data.event == "twstream") {
    // lets add a new twitter listener for this search term
    // and restart twitter stream listening
    twitterListener()
  } else {
    // send to browser
    socket.emit('event', { event:"hello", text: 'hello world' });
  }
})
*/

/*
https://github.com/AvianFlu/ntwitter
TODO:  
  - send tweet stream messages one at a time (instead of resending entire list)
  - allow hubot messages "twstream beer" to add new searches to tweet stream


*/
var pieTwData = [];
try {
  // this is a one time search for history of piepdx data
  twit.search('piepdx', {}, function(err, data) {
    if (data.results) {
      pieTwData = data.results
    }
    //console.log("found x tweets " + pieTwData.length)
  });
  twit.stream('statuses/filter', {'track':"piepdx"}, function(stream) {
    stream.on('data', function (data) {
      //console.log(data)
      //console.log("after data")
      //console.log(pieTwData)
      try{
        if (pieTwData.length > 9) {
          pieTwData = pieTwData.slice(0,9)
        }
        pieTwData = [data].concat(pieTwData)
        connections.forEach(function(socket){
          console.log("about to send tweet to browser?")
          socket.emit('events', { event:"tweet", data:pieTwData });
        })
      }catch(e){
        console.log(e)
      }
     
    });
  });
}catch(e){
  console.log("error on twitter ")
  console.log(e)
}
app.get('/api/tweets', mw, function(req, res) {
  res.contentType('application/json');
  res.send(pieTwData);
});
app.post('/events/update', mw, function(req, res) {
  connections.forEach(function(socket){
      console.log("about to send update to browser?")
      socket.emit('events', { event:"update", data:[] });
    })
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