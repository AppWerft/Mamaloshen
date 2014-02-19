// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.

Ti.UI.backgroundColor='white';
// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'gray',
	exitOnClose:true
});
var clearbutton = Ti.UI.createButton({
	title : 'clear',
	height : '7%',
	width : '35%',
	top : '90%',
	left : '65%'
});
var startbutton = Ti.UI.createButton({
	title : 'start',
	height : '7%',
	width : '35%',
	top : '80%',
	left : '65%'
});
var langpicker = Ti.UI.createPicker({
	height : '7%',
	width : '35%',
	top : '80%',
	left : '5%'
});
var actionpicker = Ti.UI.createPicker({
	height : '7%',
	width : '35%',
	top : '90%',
	left : '5%'
});

var conTextField = Ti.UI.createTextArea({
	title : 'results',
	editable : false,
	verticalAlign : 'top',color:'black',
	enableReturnKey : false,
	height : '70%',
	width : '90%',color:'red',
	top : '5%',
	left : '5%'
});
win.add(clearbutton);
win.add(startbutton);
win.add(conTextField);
win.add(langpicker);
win.add(actionpicker);

var lastselectedRow;
var lastselectedActionRow;

var actions = [
        Ti.UI.createPickerRow({title:'Speech',actionid:"1"}),
        Ti.UI.createPickerRow({title:'Web search',actionid:"2"}),
        Ti.UI.createPickerRow({title:'Hands free search',actionid:"3"})
     ];
actionpicker.add(actions);
lastselectedActionRow = actions[0];

function clearPicker(picker) {
	for (var i = 0, l = picker.columns.length; i < l; ++i) {
		var _col = picker.columns[0];
		if(_col)　{
			var len = _col.rowCount;
			for( var x = len - 1; x >= 0; x-- ) {
			　　　var _row = _col.rows[x];
			　　　_col.removeRow(_row);
			}
			//picker.reloadColumn(_col);
		}
	}
}

var speechrecognizerModule = require('jp.isisredirect.speechrecognizer');
Ti.API.info("module is => " + speechrecognizerModule);

conTextField.value = "isRecognitionAvailable:" + speechrecognizerModule.isRecognitionAvailable() + "\n";
conTextField.value += "isVoiceSearchHandsFreeAvailable:" + speechrecognizerModule.isVoiceSearchHandsFreeAvailable() + "\n";

var speechrecognizer = speechrecognizerModule.createSpeechRecognizer();
console.log(speechrecognizer);

clearbutton.addEventListener("click", function(e) {
	conTextField.value = "";
});
startbutton.addEventListener("click", function(e) {
	startbutton.enable = false;
	var selectedlang = lastselectedRow.title;
	var selectedaction = lastselectedActionRow.actionid;
	speechrecognizer.setLangtag(selectedlang);
	speechrecognizer.setAction(selectedaction);
	speechrecognizer.start();
	console.log('speechrecognizer.start()');
});

langpicker.addEventListener('change', function(e) {
    lastselectedRow = e.row;
});
actionpicker.addEventListener('change', function(e) {
    lastselectedActionRow = e.row;
});

var firstselect = 0;

speechrecognizerModule.addEventListener(speechrecognizerModule.LANGUAGEDETAILS, function(e) {
	console.log(e);
	clearPicker(langpicker);
	var langpref = e[speechrecognizerModule.LANGUAGE_PREFERENCE];
	var langs = e[speechrecognizerModule.SUPPORTED_LANGUAGES];
	firstselect = 0;
	lastselectedRow = null;
	var pickerdata = [];
	for (var i =0,l = langs.length; i < l; ++i) {
		pickerdata.push(Ti.UI.createPickerRow({
			title : langs[i]
		}));
		if (langs[i] == langpref) {
			firstselect = i;
			lastselectedRow = pickerdata[i];
		}
	}
	if (lastselectedRow == null) {
		lastselectedRow = pickerdata[0];
	}
	langpicker.add(pickerdata);
	
	if (firstselectDone) {
		langpicker.setSelectedRow(0, firstselect);
	}

	startbutton.enable = true;

}); 

var firstselectDone = false;
win.addEventListener('postlayout', function(e){
	if (!firstselectDone) {
		langpicker.setSelectedRow(0, firstselect);
		firstselectDone = true;
	}
});

speechrecognizer.addEventListener(speechrecognizerModule.READYFORSPEECH, function(e) {
	console.log('READYFORSPEECH');
	conTextField.value += e.type +"\n";
});
speechrecognizer.addEventListener(speechrecognizerModule.BEGINNINGOFSPEECH, function(e) {
	console.log('BEGINNINGOFSPEECH');
	conTextField.value += e.type +"\n";
});
speechrecognizer.addEventListener(speechrecognizerModule.BUFFERRECEIVED, function(e) {
	console.log('BUFFERRECEIVED');
	conTextField.value += e.type +"\n";
});
 too many logs
speechrecognizer.addEventListener(speechrecognizerModule.RMSCHANGED, function(e) {
	conTextField.value += e.type +"\n";
});

speechrecognizer.addEventListener(speechrecognizerModule.ENDOFSPEECH, function(e) {
	console.log('ENDOFSPEECH');
	conTextField.value += e.type +"\n";
});
speechrecognizer.addEventListener(speechrecognizerModule.ERROR, function(e) {
	conTextField.value += e.type + ":" + e.error + "\n";
	startbutton.enable = true;
	console.log('ERROR');
	speechrecognizer.stop(); // 
});
speechrecognizer.addEventListener(speechrecognizerModule.EVENT, function(e) {
	conTextField.value += e.type + "\n";
});
speechrecognizer.addEventListener(speechrecognizerModule.PARTIALRESULTS, function(e) {
	console.log('PARTIALRESULTS');
	conTextField.value += e.type +"\n";
	conTextField.value += e.results +"\n";
	conTextField.value += e.confidence_scores +"\n";
});

speechrecognizer.addEventListener(speechrecognizerModule.RESULTS, function(e) {
	console.log('FULLRESULTS');
	conTextField.value += e.type +"\n";
	conTextField.value += e.results +"\n";
	conTextField.value += e.confidence_scores +"\n";
	startbutton.enable = true;
	
});

speechrecognizerModule.getLanguageDetails();

win.open();


