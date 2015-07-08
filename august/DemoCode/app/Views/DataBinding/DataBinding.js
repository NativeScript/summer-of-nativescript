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
  var fullUrl = "";

  if (session.Title) {
    console.log("urlConverter Called", session.Title);

    var headshotUrl = session.Speakers[0].HeadShot;
    fullUrl = "https://www.thatconference.com" + headshotUrl + "?width=50";
    console.log(fullUrl);
  }

  return fullUrl;
}

app.resources["urlConverter"] = urlConverter;
