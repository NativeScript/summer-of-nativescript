//Core Modules
var observableModule = require("data/observable");

//UI Controls
var colorModule = require("color");
var borderModule = require("ui/border");
var labelModule = require("ui/label");
var gesturesModule = require("ui/gestures");
var dialogs = require("ui/dialogs");

//My Global
var _page;

exports.loaded = function(args) {
  _page = args.object;
  _page.ios.title = "Layout and Controls";
};

exports.createControls = function(args) {
  var wrapLayout = _page.getViewById("myWrapLayout");

  for(var i = 0; i < 25; i++) {
    createControls(wrapLayout, i);
  };
};

function createControls(container, number){

  var label = new labelModule.Label();
  label.text = number;
  label.width = 100;

  var border = new borderModule.Border();
  border.cornerRadius = 10;
  border.borderWidth = 1;
  border.borderColor = new colorModule.Color("#FF0000");
  border.content = label;

  border.observe(gesturesModule.GestureTypes.tap, function () {
    borderTapped(number);
  });

  container.addChild(border);
};

function borderTapped(i) {
  var options = {
    title: "You Selected",
    message: "Selected: " + i,
    okButtonText: "OK"
  };

  dialogs.alert(options).then(function () {
      console.log("In Then.... " + i);
  });
};
