# Summer of NativeScript: September Lab

## What are you learning?

In this you're going to extend the basic app you built in the first two labs and add the ability to create memes. Along the way you'll learn about the following NativeScript concepts:

* Accessing iOS and Android APIs
* Using npm modules
* Using NativeScript plugins

## Table of contents

* [Step 0: Getting setup](#step-0)
* [Step 1: Add boilerplate](#step-1)
* [Step 2: Add in native code](#step-2)
* [Step 3: Advanced native code usage](#step-3)
* [Step 4: Using npm modules](#step-4)
* [Step 5: Using NativeScript plugins](#step-5)

<h2 id="step-0">Step 0: Getting setup</h2>

This lab uses the NativeScript CLI for all of its examples. You can [refer back to the first lab](https://github.com/tjvantoll/summer-of-nativescript/blob/master/july/lab-cli.md) if you're having trouble getting the NativeScript CLI up and running.

To start this lab run the following commands:

```
$ git clone https://github.com/tjvantoll/summer-of-nativescript-lab.git
$ cd lab-3-start
```

From there run `tns platform add android` and `tns platform add ios` (if you're on a Mac) so you're ready run your app on both platforms. If you run the app (`tns run ios --emulator` or `tns run android --emulator`) and click on an image you should see the screen below:

![](android-starting-view.png)
![](ios-starting-view.png)

This screen is the create meme screen, and it's what you'll be building throughout this lab. Here's what the final state of this app will be:


Let's get started.

<h2 id="step-1">Step 1: Add boilerplate</h2>

The first thing you're going to need is a bit of boilerplate code. Start by opening `app/views/create-meme/create-meme.xml` and replace the `<!-- code goes here -->` comment with the following XML:

```xml
<Image imageSource="{{ memeImage }}" />
<TextField hint="Top text" text="{{ topText }}" />
<TextField hint="Bottom text" text="{{ bottomText }}" />

<GridLayout rows="auto, auto" columns="auto, *">
	<Label row="0" col="0" cssClass="settingsLeft" text="Text Size" />
	<Slider row="0" col="1" cssClass="settingRight" value="{{ fontSize }}" minValue="10" maxValue="100" />

	<Label row="1" col="0" cssClass="settingsLeft" text="Black Text" />
	<Switch row="1" col="1" cssClass="settingsRight" checked="{{ isBlackText }}" />
</GridLayout>
```

This adds a placeholder for an image (`<Image>`), and four form controls that you'll soon use to manipulate the image itself. For now notice that the image's `imageSource` attribute is set to `{{ memeImage }}`. Let's switch over to this page's JavaScript to fill that attribute with an actual image.

You may recall that [NativeScript's `navigate()` method](https://docs.nativescript.org/navigation#navigation) gives you pass data from one page to the next. In the case of this app, the home page is already passing the image the user selects to the create meme page, so all you need to do get a reference to that image and set in on this new page's view model.

To do so, open `app/views/create-meme/create-meme.js` and paste in the following code:

``` javascript
var observable = require("data/observable");
var viewModel = new observable.Observable();
var page;

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = viewModel;
};
exports.navigatedTo = function() {
	viewModel.set("memeImage", page.navigationContext);
};
```

The `loaded()` function takes care of setting the page's `bindingContext`, or the object accessible with the `{{ }}` syntax, and the `navigatedTo()` function sets the view model's `"memeImage"` property, so that `<Image imageSource="{{ memeImage }}" />` now renders. If you run your app again you should see images appearing on the new create meme page.

<h2 id="step-2">Step 2: Add in native code</h2>

NativeScript's defining feature is that it gives you direct access to iOS and Android APIs in JavaScript directly. This gives your NativeScript app the power to do anything an iOS or Android app can do—in JavaScript.

Going back to our app, think for a minute about what you need to do to create a meme. To generate an image file, you need to rasterize text onto an image file, and iOS and Android both have APIs to make this possible.

Before diving into the code that writes text on images, which is admittedly a bit complex, let's look at a simple example of how accessing native APIs works.

Paste the following line of code at the very top of `create-meme.js`.

```js
var frame = require("ui/frame");
```

And then paste the following inside the `exports.loaded()` function:

```js
if (frame.topmost().ios) {
	var navBar = frame.topmost().ios.controller.navigationBar;
	navBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(1, 0, 0, 0);
}
```

This code get a reference to the iOS [`UINavigationController`](https://developer.apple.com/library/prerelease/ios/documentation/UIKit/Reference/UINavigationBar_Class/index.html) class and sets its [`barTintColor`](https://developer.apple.com/library/prerelease/ios/documentation/UIKit/Reference/UINavigationBar_Class/index.html#//apple_ref/occ/instp/UINavigationBar/barTintColor) to an rgb value that represents red. The end result is the navigation bar now appears red instead of the green that your JustMeme app usually uses.

Notice just how easy NativeScript makes accessing these native APIs. There's no abstraction you have to go through to use APIs like [`UIColor`](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIColor_Class/)—you just type `UIColor`.

With simple examples like this it's reasonably simple to see how to convert Objective-C code to JavaScript, but things can get complex . When you run into these situations refer to the NativeScript docs, which walk through how to convert Objective-C iOS code and Java Android code into JavaScript code NativeScript can run. (Here are the [iOS docs](http://docs.nativescript.org/runtimes/ios/Overview); here are the [Android docs](http://docs.nativescript.org/runtimes/android/overview)).

Now that you've seen a basic example, let's move onto adding text to images.

<h2 id="step-3">Step 3: Advanced native code usage</h2>

Let's start by adding the code that makes the text work and then discuss how it works. First, add the following two lines of code to the top of `create-meme.js`:

```js
var originalImage;
var imageManipulation = require("../../shared/image-manipulation/image-manipulation");
```

Next, replace the current `exports.navigatedTo()` function with the one shown below:

``` js
exports.navigatedTo = function() {
	// Save a reference to the original image
	originalImage = page.navigationContext;

	// Show the starting image on the screen
	viewModel.set("memeImage", originalImage);

	// Listen for changes to the form controls
	viewModel.addEventListener(observable.Observable.propertyChangeEvent, function(changes) {
		// No need to redraw text if the image changed
		if (changes.propertyName === "memeImage") {
			return;
		}

		// Add text to the original image
		var image = imageManipulation.addText({
			image: originalImage,
			topText: viewModel.get("topText"),
			bottomText: viewModel.get("bottomText"),
			fontSize: viewModel.get("fontSize"),
			isBlackText: viewModel.get("isBlackText")
		});

		// Show the new image, with text applied, on the screen
		viewModel.set("memeImage", image);
	});
};
```

Let's break down what's happening here, starting with the line below:

```js
viewModel.addEventListener(observable.Observable.propertyChangeEvent, function(){ ... });
```

To understand this code, recall that `viewModel` is an observable that you used to bind XML UI components to JavaScript properties. Therefore when the value of the form controls bound to this object change—including the two textfields, the font size slider, and the text color switch—NativeScript fires a `propertyChangeEvent` that you can subscribe to, which is exactly what the code above does; therefore anytime the user types a letter, or moves the slider, you'll run the code within this `propertyChangeEvent` handler.

The magic of actually adding text to the images happens with this call to the `imageManipulation` module:

```
// Add text to the original image
var image = imageManipulation.addText({
    image: originalImage,
    topText: viewModel.get("topText"),
    bottomText: viewModel.get("bottomText"),
    fontSize: viewModel.get("fontSize"),
    isBlackText: viewModel.get("isBlackText")
});
```

To see what's actually happening here, open your app's `app/shared/image-manipulation/image-manipulation.ios.js` and `app/shared/image-manipulation/image-manipulation.android.js` files. You'll see a bunch of Android and iOS APIs that used to actually draw text on images.

Let's experiment with a few of these APIs to see just how easy NativeScript makes it to play with native code. For example find the line in `image-manipulation.ios.js` that uses the `UIFont` class:

```js
font = UIFont.boldSystemFontOfSize(fontSize);
```

Try playing with the [`UIFont` API](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIFont_Class/) to see ways you can change the text. For instance, change `boldSystemFontOfSize` to `italicSystemFontOfSize` and run the app again to see what happens.

In `image-manipulation.android.js`, find the line that uses `android.graphics.Typeface`:

```js
var type = android.graphics.Typeface.create("Helvetica",
	android.graphics.Typeface.BOLD);
```

Try playing with the [Android Typeface API](http://developer.android.com/reference/android/graphics/Typeface.html) to display text various ways. For instance, try changing the font family from `"Helvetica"`, or change `android.graphics.Typeface.BOLD` to `android.graphics.Typeface.ITALIC`.

When you're ready, and when the meme text matches your personal preferences, let's move onto see how we can use npm modules in this app.

<h2 id="step-4">Step 4: Using npm modules</h2>

<h2 id="step-5">Step 5: Using NativeScript plugins</h2>

## Wrapping up