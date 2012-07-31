// a sample plugin
(function(win,doc,pie) {
  var test_mustache = '<div>{{text}}</div>'

  pie.addPlugin("hello", "hello", function(data) {
    // do what you want
    var html=  Mustache.to_html(test_mustache, data)
    $("#schedule").append(html)
  })

}(window,document,pie));
