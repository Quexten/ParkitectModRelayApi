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

var port = 80;
var router = express.Router();

var downloads = []

router.get('/', function(req, res) {
	var item_id = req.query.item_id
	console.log("item_id" + item_id)
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
			if (downloads.indexOf(item_id) >= 0 && downloads[item_id].time == time) {				
				res.json({ "download": downloads[item_id].download })
			} else {		
				request.get('http://parkitect-downloader/download?item_id=' + item_id, { json: true }, (err, downloadRes, body) => {
					if (err == null) {
						res.json({ "download": body.download })
						downloads[item_id] = {
							time: time,
							download: body.download
						}
					} else {
						res.json({ "error": body.error })
					}
				});
			}
		})
	}
});

app.use('/download', router)

app.listen(port);
