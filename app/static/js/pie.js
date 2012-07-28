

(function(win,doc) {

  var dloc = doc.location
    , context = this
    , ckie = doc.cookie
    , l = 'length'
    , cache = {}
    , socket = undefined
    , templates = {}

  var pie = pie || {}
  win.pie = pie;


  pie.connect = function(host) {
    socket = io.connect(host);


    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
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