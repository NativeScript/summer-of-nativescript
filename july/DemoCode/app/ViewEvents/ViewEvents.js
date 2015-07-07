var observableModule = require("data/observable");
var _page;
var _message = "";
var _viewModel = new observableModule.Observable();

exports.loaded = function(args) {
  _page = args.object;
  _page.ios.title = "Events";
  _page.bindingContext = _viewModel;

  setLogMessage("loaded");
  console.log("loaded");
};

exports.navigatingTo = function() {
  setLogMessage("navigatingTo");
  console.log("navigatingTo");
};

exports.navigatedTo = function() {
  var navigatedContext = _page.navigationContext;

  setLogMessage("navigatedTo");
  console.log("navigatedTo");
};

exports.navigatingFrom = function() {
  setLogMessage("navigatingFrom");
  console.log("navigatingFrom");
};

exports.navigatedFrom = function() {
  setLogMessage("navigatedFrom");
  console.log("navigatedFrom");
};

exports.unloaded = function() {
  setLogMessage("unloaded");
  console.log("unloaded");
};

function setLogMessage(message) {
  _message = _message + message + "\n\r";
  _viewModel.set("logMessage", _message);
};
