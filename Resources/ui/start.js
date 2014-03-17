var Ideomes = require('controls/ideomes');
var speechrecognizerModule = require('jp.isisredirect.speechrecognizer');
var speechrecognizer = speechrecognizerModule.createSpeechRecognizer();
Ideomes.Init();

var self = Ti.UI.createWindow({
	fullscreen : true,
	exitOnClose : true,
	backgroundColor : 'black'
});
self.addEventListener("open", function(e) {
	var activity = self.getActivity();
	activity.onCreateOptionsMenu = function(e) {
		var speaker = e.menu.add({
			title : "LISTEN",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			icon : "speaker.png"
		});
		speaker.addEventListener("click", function(e) {
			e.source.opacity = 0.5;
			if (self.sound && Ti.Network.online) {
				var url = 'http://translate.google.com/translate_tts?tl=en&q=' + encodeURI(ideom.e);
				console.log(url);
				self.sound.setUrl(url);
				self.sound.play();
			} else {
				Ti.UI.createNotification({
					message : 'You need internet to listen the english phrase'
				}).show();
			}
		});
		var mic = e.menu.add({
			title : "Speech",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			icon : "/mic.png"
		});
		mic.addEventListener("click", function(e) {
			speechrecognizer.setLangtag('en-US');
			speechrecognizer.setAction(1);
			speechrecognizer.start();
			console.log('Speech can start');
		});
	};
	activity.invalidateOptionsMenu();
});

speechrecognizer.addEventListener(speechrecognizerModule.READYFORSPEECH, function(e) {
	Ti.UI.createNotification({
		message : 'Ready for speech.'
	}).show();
	//	conTextField.value += e.type +"\n";
});
speechrecognizer.addEventListener(speechrecognizerModule.RESULTS, function(e) {
	console.log(e.results);
	if (e.results && e.results.split(',')[0]) {

		var opts = {
			options : e.results.split(','),
			title : 'possible interpretations'
		};

		Ti.UI.createOptionDialog(opts).show();
		
		
	}
	speechrecognizer.stop();
	//
});

self.sound = Ti.Media.createAudioPlayer();

self.open();
var german = Ti.UI.createLabel({
	left : '10dp',
	right : '10dp',
	textAlign : 'left',
	font : {
		fontSize : '54dp',
		fontFamily : 'TempoFont'
	},
	color : '#ccc'
});
var english = Ti.UI.createLabel({
	bottom : '100dp',
	left : '10dp',
	right : '10dp',
	textAlign : 'left',
	height : Ti.UI.SIZE,
	width : Ti.UI.FILL,
	font : {
		fontSize : '55dp',
		fontFamily : 'TempoFontItalic'
	},
	color : '#ccc'
});
var ratio = Ti.UI.createLabel({
	bottom : '5dp',
	right : '5dp',
	font : {
		fontSize : '12dp',
	},
	color : '#ddd'
});

self.add(german);
self.add(english);
self.add(ratio);

var ideom = Ideomes.getNext();
german.setText(ideom.d);
ratio.setText(ideom.ratio);

self.addEventListener('swipe', function(_e) {
	if (_e.direction == 'up' || _e.direction == 'down') {
		german.animate({
			top : 0,
			right : 0,
			transform : Ti.UI.create2DMatrix({
				scale : 0.35
			})
		}, function() {
			german.setWidth(Ti.UI.FILL);
			english.opacity = 0;
			english.setText(ideom.e);
			english.animate({
				opacity : 1
			});

		});
	} else if (_e.direction == 'left' || _e.direction == 'right') {
		english.setText('');
		german.setTop(null);
		german.setRight(null);

		german.setTransform(Ti.UI.create2DMatrix({
			scale : 1
		}));
		ideom = (_e.direction == 'left' ) ? Ideomes.getNext() : Ideomes.getPrev();
		german.setText(ideom.d);
		self.sound.release();
		ratio.setText(ideom.ndx + '/' + ideom.count);
	}
});

speechrecognizer.addEventListener(speechrecognizerModule.READYFORSPEECH, function(e) {
	//	conTextField.value += e.type +"\n";
});
speechrecognizer.addEventListener(speechrecognizerModule.BEGINNINGOFSPEECH, function(e) {
	//	conTextField.value += e.type +"\n";
});
speechrecognizer.addEventListener(speechrecognizerModule.BUFFERRECEIVED, function(e) {
	//	conTextField.value += e.type +"\n";
});
/* too many logs
 speechrecognizer.addEventListener(speechrecognizerModule.RMSCHANGED, function(e) {
 //	conTextField.value += e.type +"\n";
 });
 */
speechrecognizer.addEventListener(speechrecognizerModule.ENDOFSPEECH, function(e) {
	console.log(e.type);
});
speechrecognizer.addEventListener(speechrecognizerModule.ERROR, function(e) {
	if (e.error != 5) {
		console.log(e.type + ":" + e.error + " " + e.errormessage);
	}
	//startbutton.enable = true;
});
speechrecognizer.addEventListener(speechrecognizerModule.EVENT, function(e) {
	console.log(e.type);
});
speechrecognizer.addEventListener(speechrecognizerModule.PARTIALRESULTS, function(e) {
	console.log(e.type + e.result);
});
