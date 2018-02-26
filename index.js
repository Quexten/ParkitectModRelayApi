var SteamWorkshop = require('steam-workshop');
var steamWorkshop = new SteamWorkshop("");

function getTimeUpdated(id, callback) {
	steamWorkshop.getPublishedFileDetails (id, function (err, suc) {
		callback(suc[0]["time_updated"])
	})
}

var express    = require('express');
var app        = express();              
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 80;

var router = express.Router();

router.get('/', function(req, res) {
	if (req.baseUrl == "/getVersion") {
		var time_updated = getTimeUpdated(req.query.item_id, function (time) {			
			res.json({ version: time });
		})
	}
});

app.use('/getVersion', router);

app.listen(port);