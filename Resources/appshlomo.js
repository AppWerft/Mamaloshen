Ti.UI.backgroundColor = 'black';
var win = Ti.UI.createWindow({
	backgroundColor : 'white',
	exitOnClose : true,
	fullscreen : true
});
win.open();
var mic = Ti.UI.createImageView({
	bottom : 20,
	width : '80%',
	height : '80%',
	image : 'mic.png',
	visible : false
});
win.add(mic);
var speechRecognizer = require('co.il.webe.speechrecognizer');
var speechRecognizerProxy = speechRecognizer.getSpeechRecognizer({
	language : 'de-De',
	onResults : function(e) {
		if (e.words) {
			output.setText(e.words[0]);
			for (var i = 0; i < e.words.length; i++) {
				Ti.API.info('e.words[' + i + '] = ' + e.words[i]);
			}
			btnListen.show();
		}
	},
	onReadyForSpeech : function(e) {
		output.setText('');
	},
	onPartialResults : function(e) {
		Ti.API.info('Partial Results:');
		if (e.words) {
			for (var i = 0; i < e.words.length; i++) {
				Ti.API.info('e.words[' + i + '] = ' + e.words[i]);
			}
		}
	},
	onError : function(e) {
		switch (e.errorCode) {
			case speechRecognizer.ERROR_AUDIO:
				Ti.API.error('ERROR_AUDIO');
				break;

			case speechRecognizer.ERROR_CLIENT:
				Ti.API.error('ERROR_CLIENT');
				break;

			case speechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
				Ti.API.error('ERROR_INSUFFICIENT_PERMISSIONS');
				break;

			case speechRecognizer.ERROR_NETWORK:
				Ti.API.error('ERROR_NETWORK');
				break;

			case speechRecognizer.ERROR_NETWORK_TIMEOUT:
				Ti.API.error('ERROR_NETWORK_TIMEOUT');
				break;

			case speechRecognizer.ERROR_NO_MATCH:
				Ti.API.error('ERROR_NO_MATCH');
				break;

			case speechRecognizer.ERROR_RECOGNIZER_BUSY:
				Ti.API.error('ERROR_RECOGNIZER_BUSY');
				break;

			case speechRecognizer.ERROR_SERVER:
				Ti.API.error('ERROR_SERVER');
				break;

			case speechRecognizer.ERROR_SPEECH_TIMEOUT:
				Ti.API.error('ERROR_SPEECH_TIMEOUT');
				break;
		}
	},
	onEndOfSpeech : function(e) {
		Ti.API.info('End of speech');
		mic.visible = false;
	},
	onBeginningOfSpeech : function(e) {
		mic.visible = true;
		Ti.API.info('Beginning of speech');
	},
});
//speechRecognizerProxy.setLanguage('de-DE');

Ti.API.info("proxy is => " + speechRecognizerProxy);
Ti.API.info("language is => " + speechRecognizerProxy.language);

var btnListen = Ti.UI.createButton({
	width : '150dp',
	height : '70dp',
	title : 'Spreche jetzt!'
});

var output = Ti.UI.createLabel({
	color : 'black',
	bottom : 10,
	text : ''
});
win.add(output);
win.add(btnListen);

btnListen.addEventListener('click', function(e) {
	Ti.API.info('start listening');
	speechRecognizerProxy.startListening();
	btnListen.hide();
});
