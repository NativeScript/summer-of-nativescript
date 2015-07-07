
var observableModule = require("data/observable");
var _viewModel = new observableModule.Observable();

//My Global
var _page;

exports.loaded = function(args) {
  _page = args.object;
  _page.ios.title = "Layout and Controls";
};
