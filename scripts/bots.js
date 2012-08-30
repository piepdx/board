var util = require('util')
  , twitter = require('ntwitter')
  , irc = require('irc')

/*
var client = new irc.Client('chat.freenode.net', 'bot', {
    channels: ['#piepdx'],
});

client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
});
*/

function makeBot(name){

  var sender = function(){}
    , defcb = function(){}
    , msgs = []
    , found
    , ircClient 
  function bot(){
  }
  /**
   *  connect to irc
  */
  bot.connect = function(cb){
    try {
      if (ircClient) ircClient.disconnect()
    } catch(e) {}
    ircClient = new irc.Client('chat.freenode.net', config.botname, {
        channels: ['#piepdx'],
    });

    ircClient.addListener('message', function (from, to, m) {
      util.log(from + ' => ' + to + ': ' + m)
      if (m.indexOf(config.botname) == 0) {
        m = m.substring(config.botname.length + 1)
        bot.msg(from, m)
      } else if (m.indexOf("slice ") == 0) {
        m = m.substring("slice ")
        bot.msg(from, m)
      }
    });
    return bot
  }
  /**
   *  The send function, for when it finds a message
  */
  bot.send = function(cb){
    if (!arguments.length) return sender;
    sender = cb
    return bot
  }
  /**
   *  The default callback
  */
  bot.default = function(cb){
    if (!arguments.length) return defcb;
    defcb = cb
    return bot
  }
  /**
   *   .on(function(rematch, from, msg){
   *      return {from_user:from,text:msg}
   *    })
  */
  bot.on = function(re, cb){
    msgs.push({re:re,cb:cb})
    return bot
  }
  bot.msg = function(from, m){
    var matched = false
      , themsg = null
    msgs.forEach(function(msg){
      found = m.match(msg.re)
      if (found){
        themsg = msg.cb(found, from, m)
        matched = true
      } 
    })
    if (!matched){
      themsg = defcb(null,from, m)
    }
    sender(themsg)
    return bot
  }
  return bot
}

// make global tvbot 
var tvbot = makeBot("tvbot").connect()
exports.tvbot = tvbot

// the default response
tvbot.default(function(re, from, msg){
  util.log("creating default msg")
  return {from_user:from, text:msg}
})

tvbot.on(RegExp(/ascii( me)? (.+)/i),function(re, from, m){
  util.log(re)
  return {from_user:from, text: "ascii me"}
})
/*
tvbot.send(RegExp(/ascii( me)? (.+)/i),function(re, m){
  util.log(re)
})
*/