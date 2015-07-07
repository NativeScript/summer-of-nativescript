var frameModule = require("ui/frame");

exports.pageLoaded = function(args) {
    var page = args.object;
    page.bindingContext = {};
}

exports.gotoEvents = function(args) {
  frameModule.topmost().navigate({
  moduleName: "./Views/ViewEvents/ViewEvents",
  	context: "HELLO!!!",
  	animated: true
  });
}

exports.gotoLayoutAndControls = function(args) {
  frameModule.topmost().navigate({
  moduleName: "./Views/Layout/Layout",
  	context: "HELLO!!!",
  	animated: true
  });
}

exports.gotoDataBinding = function(args) {
  frameModule.topmost().navigate({
  moduleName: "./Views/DataBinding/DataBinding",
  	context: "HELLO!!!",
  	animated: true
  });
}

exports.gotoNativeCall = function(args) {
  frameModule.topmost().navigate({
  moduleName: "./Views/NativeCall/NativeCall",
  	context: "HELLO!!!",
  	animated: true
  });
}
