var SteamWorkshop = require('steam-workshop');
var steamWorkshop = new SteamWorkshop("");

function getInfo(id, callback) {
	steamWorkshop.getPublishedFileDetails (id, function (err, suc) {
		if (err)
			callback("err")
		else
			callback(suc[0]["time_updated"], suc[0]["creator_app_id"])
	})
}

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;
var router = express.Router();

var jsonfile = require('jsonfile')

var downloads = []

router.get('/', function(req, res) {
	var item_id = req.query.item_id
	
	console.log("Request item Id" + item_id)
	
	if (item_id == null || !(item_id == parseInt(item_id, 10))) {
	 	res.json({ "error": "format" });
		return
	}

	if (req.baseUrl == "/getVersion") {
		var time_updated = getInfo(req.query.item_id, function (time) {
			if (time != "error")
				res.json({ version: time });
			else {
				res.json({ error: "format" })
			}
		})
	}
	if (req.baseUrl == "/download") {		
		getInfo(item_id, function (time, app_id) {
			if (app_id != 453090) {
				res.json({ "error": "Wrong app_id" })
				return
			}
			var contains_entry = downloads[item_id] !== void 0 
			var version_matches = contains_entry && downloads[item_id].time == time

			if (contains_entry && version_matches) {	
				console.log("From cache")
				res.json({ "download": downloads[item_id].download })
			} else {		
				console.log("Download")
				request.get('http://parkitect-downloader/download?item_id=' + item_id, { json: true }, (err, downloadRes, body) => {
					if (err == null) {
						res.json({ "download": body.download })
						downloads[item_id] = {
							time: time,
							download: body.download
						}						
						var file = '/workshop/data.json'
						jsonfile.readFile(file, function(err, obj) {
						  console.dir(obj)
						})
					} else {
						res.json({ "error": body.error })
					}
				})
			}
		})
	}
})

app.use('/getVersion', router)
app.use('/download', router)

console.log("Api is now running on port:" + port)
console.log("Press command + c go back to the command line")
app.listen(port)
