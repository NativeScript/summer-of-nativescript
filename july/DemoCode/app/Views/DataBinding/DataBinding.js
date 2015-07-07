
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
    _viewModel.set("urlConverter", urlConverter);

  });
};

var urlConverter = {
  toView: function(url){
    
    var headshotUrl = url.get("HeadShot")
    console.log(headshotUrl);
    console.log("converter called");

    return 'https://www.thatconference.com' + headshotUrl + '?width=100';
  }
}
/*
exports.urlConverter = function(url){
  console.log("converter was called");

  return 'https://www.thatconference.com' + url + '?width=100';
};
*/

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
