// a sample plugin
(function(win,doc,pie) {
  var test_mustache = '<div>{{text}</div>'

  pie.plugin("test", "test", function(data) {
    // do what you want
    var html=  Mustache.to_html(test_mustache, data)
    $("#schedule").append(html)
  })

}(window,document,pie));
