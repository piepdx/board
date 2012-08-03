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

  var msgcb = function(){}
    , defcb = function(){}
    , msgs = []
    , found
  function bot(){
  }
  /**
   *  The send function, for when it finds a message
  */
  bot.send = function(cb){
    if (!arguments.length) return msgcb;
    msgcb = cb
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
  bot.on = function(re, cb){
    msgs.push({re:re,cb:cb})
    return bot
  }
  bot.msg = function(m){
    var matched = false
      , themsg = null
    msgs.forEach(function(msg){
      found = m.match(msg.re)
      if (found){
        themsg = msg.cb(found, m)
      } else {
        util.log("not found" + msg.re)
      }
    })
    if (!matched){
      themsg = defcb(null, m)
    }
    msgcb(themsg)
    return bot
  }
  return bot
}

// make global tvbot 
var tvbot = makeBot("tvbot")
exports.tvbot = tvbot

tvbot.on(RegExp(/ascii( me)? (.+)/i),function(re, m){
  util.log(re)
  return "ascii me"
})
/*
tvbot.send(RegExp(/ascii( me)? (.+)/i),function(re, m){
  util.log(re)
})
*/