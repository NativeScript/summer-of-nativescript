var app = require("application");
var frameModule = require("ui/frame");

exports.loaded = function(args) {
	var page = args.object;

	if (app.ios) {
		page.ios.title = "Native Calls";
		frameModule.topmost().ios.navBarVisibility = "auto";

		var controller = frameModule.topmost().ios.controller;

		var navigationItem = controller.visibleViewController.navigationItem;
		navigationItem.setHidesBackButtonAnimated(true, false);

		var navBar = controller.navigationBar;
		navBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.35, 0.90, 0.0, 1.0);
		navBar.barStyle = 0;
		navBar.tintColor = UIColor.blackColor();

		navBar.titleTextAttributes = NSDictionary.alloc().initWithObjectsForKeys(
			[UIColor.darkGrayColor()],
			[NSForegroundColorAttributeName]
		);
	}
};

//iOS Manifest
//https://raw.githubusercontent.com/NativeScript/NativeScript/master/ios.d.ts

//Android Manifest
//https://raw.githubusercontent.com/NativeScript/NativeScript/master/android17.d.ts
