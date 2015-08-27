if (applicationModule.ios) {
	frameModule.topmost().ios.navBarVisibility = "auto";

	var controller = frameModule.topmost().ios.controller;

	var navigationItem = controller.visibleViewController.navigationItem;
	navigationItem.setHidesBackButtonAnimated(true, false);

	var navBar = controller.navigationBar;
	navBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.35, 0.90, 0.0, 1.0);
	navBar.barStyle = 0;
	navBar.tintColor = UIColor.blackColor();

	navBar.titleTextAttributes = NSDictionary.alloc().initWithObjectsForKeys(
		[UIColor.blackColor()],
		[NSForegroundColorAttributeName]
	);
}

<Page.actionBar>
	<ActionBar title="Create New">
		<ActionBar.actionItems>
			<ActionItem text="Share" tap="share" ios.position="right" />
		</ActionBar.actionItems>
	</ActionBar>
</Page.actionBar>


var socialShare = require("nativescript-social-share");


exports.share = function() {
	socialShare.shareImage(meme.get("memeImage"));
};