var application = require("application");
application.mainModule = "home-view";
application.cssFile = "./app.css";

application.onLaunch = function (context) {
  console.log("onLaunch");
};

application.onSuspend = function () {
  console.log("onSuspend");
};

application.onExit = function () {
  console.log("onExit");
};

application.onUncaughtError = function (error) {
  console.log("onUncaughtError");
};

global.whosAwesome = "TJ is Cool!";

application.start();
