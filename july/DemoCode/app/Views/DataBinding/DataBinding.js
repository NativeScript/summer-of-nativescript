var app = require("application");

var observableModule = require("data/observable");
var httpModule = require("http");

var _viewModel = new observableModule.Observable();

//My Global
var _page;

exports.loaded = function(args) {
  _page = args.object;
  _page.ios.title = "DataBinding";
  _page.bindingContext = _viewModel;
};

exports.navigatedTo = function(args) {
  getSessions().then(function(result){
    var sessions = JSON.parse(result.content);
    _viewModel.set("sessions", sessions);
  });
};

function getSessions(){
  // That Conference Sessions
  var tc_url = "https://www.thatconference.com/api3/Session/GetAcceptedSessions";

  var requestOptions = {
    method: "GET",
    url: tc_url,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return httpModule.request(requestOptions);
}








var urlConverter = function (session) {
  if (session) {
    console.log("urlConverter Called", session.Title);
    console.log(Object.keys(session.Speakers));
  }
  //return 'https://www.thatconference.com' + url.Speakers[0].HeadShot + '?width=100';
  return "foo";
}

app.resources["urlConverter"] = urlConverter;
