// SmsListener v1.1
// This is an example file to demonstrate the use of the SpeechRecognizer Module in a Titanium Android project

var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
win.open();

var speechRecognizer = require('co.il.webe.speechrecognizer');
Ti.API.info("module is => " + speechRecognizer);

var speechRecognizerProxy = speechRecognizer.getSpeechRecognizer({
	onResults: function(e) {
		Ti.API.info('Results:');
		if (e.words) {
			for (var i = 0; i < e.words.length; i++) {
				Ti.API.info('e.words[' + i + '] = ' + e.words[i]);
			}
		}
	},
	onReadyForSpeech: function(e) {
		Ti.API.info('Ready for speech');
	},
	onPartialResults: function(e) {
		Ti.API.info('Partial Results:');
		if (e.words) {
			for (var i = 0; i < e.words.length; i++) {
				Ti.API.info('e.words[' + i + '] = ' + e.words[i]);
			}
		}
	},
	onError: function(e) {
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
	onEndOfSpeech: function(e) {
		Ti.API.info('End of speech');
	},
	onBeginningOfSpeech: function(e) {
		Ti.API.info('Beginning of speech');
	},
});
Ti.API.info("proxy is => " + speechRecognizerProxy);
Ti.API.info("language is => " + speechRecognizerProxy.language);

var btnListen = Ti.UI.createButton({
	width: '150dp',
	height: '70dp',
	title: 'Start Listening'
});
win.add(btnListen);

btnListen.addEventListener('click', function(e) {
	Ti.API.info('start listening');
	speechRecognizerProxy.startListening();
});