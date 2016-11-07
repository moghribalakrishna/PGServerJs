var express = require('express');
var app = express();
var q = require('q');
var fs = require('fs');
var jsonfile = require('jsonfile');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
var recordingRouteManager = require('../../routes/api/recordings/index.js');
recordingRouteManager.setConfigsForRecordingRouter(__dirname + '/recordingUT_config.json');
app.use('/recordings', recordingRouteManager.getRecordingRouter());

app.get('/createTestRecodFiles', function(req, res) {
	createRecordingUTDirectoriesAndFiles().then(function() {
		res.status(200).send('ok');
	}).catch(function() {
		res.status(300).send('error');
	});

});
var server = app.listen(3000, function() {
	var port = server.address().port;
	console.log('Example app listening at port %s', port);
});

app.get('/startServingStaticResources', function(req, res) {
	getConfigData().then(function(configData) {
		app.use('/recordings/getVideo', express.static(configData.recordFile4kDir));
		app.use('/recordings/getMotionVideo', express.static(configData.motionRecordFileDir));
		res.status(200).send('ok');
	}).catch(function() {
		res.status(300).send('error');
	});

});

function getConfigData() {
	var defered = q.defer()
	jsonfile.readFile('./recordingUT_config.json', function(err, configData) {

		defered.resolve(configData);
	});

	return defered.promise;
}

function createRecordingUTDirectoriesAndFiles() {
	"use strict";

	var defered = q.defer();

	require('shelljs/global');
	//Cleaning up the directories
	try {
		jsonfile.readFile('./recordingUT_config.json', function(err, configData) {

			//Creating the recording directories
			rm('-rf', configData.recordFile4kDir + '*');
			rm('-rf', configData.recordFile4kSnapShotDir + '*');
			rm('-rf', configData.motionRecordFileDir + '*');

			mkdir('-p', configData.recordFile4kDir);
			mkdir('-p', configData.recordFile4kSnapShotDir);
			mkdir('-p', configData.motionRecordFileDir);

			//Lets Create Sample IndexFile
			var indexFile = configData.recordFile4kDir + configData.recordFile4kIndexFile;
			var motionIndexFile = configData.motionRecordFileDir + configData.motionRecordFileIndexFile;

			touch(indexFile);
			touch(motionIndexFile);
			//Lets Create the Record files
			var recordFileCount = 0;

			var microSeconds = (new Date()).getTime() * 1000;
			while (recordFileCount < configData.NumberofRecordVideos2Create) {

				var recordFileName = 'Recording_' + microSeconds + '.mp4';
				var recordThumbNail = 'Recording_' + microSeconds + '.jpg';

				touch(configData.recordFile4kDir + recordFileName);
				touch(configData.recordFile4kDir + recordThumbNail);

				touch(configData.motionRecordFileDir + 'Motion' + recordFileName);
				touch(configData.motionRecordFileDir + 'Motion' + recordThumbNail);

				fs.appendFileSync(indexFile, 'file \'' + recordFileName + '\'\r\n', 'utf8');
				fs.appendFileSync(motionIndexFile, 'file \'' + 'Motion' + recordFileName + '\'\r\n', 'utf8');
				//touch(recordFileName);
				microSeconds += 11000000;
				recordFileCount++;
			}

			// Lets Create some snapShots 
			//_snapShot.jpg
			var milliSeconds = (new Date).getTime();
			var snapShotCount = 0;
			while (snapShotCount < configData.NumberOfSnapShots2Create) {
				var snatpShotName = configData.recordFile4kSnapShotDir + milliSeconds + '_snapShot.jpg';
				var snatpShotThumbName = configData.recordFile4kSnapShotDir + milliSeconds + '_snapShot_t.jpg';
				touch(snatpShotName);
				touch(snatpShotThumbName);
				milliSeconds += Math.floor(Math.random() * 60000000);
				snapShotCount++;
			}

			defered.resolve(true);
		});
	} catch (err) {
		defered.reject(err);
	}

	return defered.promise;
}
module.exports = server;