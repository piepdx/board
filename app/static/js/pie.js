(function(win,doc) {

  var dloc = doc.location
    , context = this
    , ckie = doc.cookie
    , l = 'length'
    , cache = {}
    , socket = undefined
    , templates = {}
    , plugins  = {}

  var pie = pie || {}
  win["pie"] = pie;


  /**
   * The Socket.IO connection
  */
  pie.connect = function(host) {
    socket = io.connect(host);
    socket.on('events', function (data) {
      console.log(data);
      _.each(plugins,function(o){
        if (data.event == o.pattern) {
          o.handler(data)
        }
      })
      //socket.emit('my other event', { my: 'data' });
    });
  }

  /**
   * the pie plugin handler, this will allow you to listen for *pattern*
   *  in hubot or twitter stream and send to a custom js browser plugin
   *  to determine how to display it
  */
  pie.addPlugin = function(name, pattern, handler) {
    // need to compile regex pattern?   
    plugins[name] = {pattern:pattern,handler:handler}
  }

  // mustache to html templating meomozing templates
  pie.mtoHtml = function(name,data) {
    try {
      if (!(name in templates)){
        var $el = $(name)
        if ($el){
          templates[name] = $el[0].innerHTML;
        }
      }
      if (name in templates){
        return Mustache.to_html(templates[name], data)
      }
    } catch (e) {
      console.log("error in templating " + name)
    }
    return ""
  }


}(window,document));