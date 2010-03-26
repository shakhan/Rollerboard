var sys = require("sys");
var url = require("url");
var qs = require("querystring");
var fu = require("./fu");
var redis = require("./redisclient");

// basic setup
HOST = null; //localhost
PORT = 3000;
fu.listen(PORT, HOST);
initialSetup();


// setup routes to files
fu.get("/", fu.staticHandler("index.html"));
fu.get("/client.css", fu.staticHandler("client.css"));
fu.get("/client.js", fu.staticHandler("client.js"));
fu.get("/jquery-1.2.6.min.js", fu.staticHandler("jquery-1.2.6.min.js"));
fu.get("/message.mustache", fu.staticHandler("message.mustache"));
fu.get("/mustache.js", fu.staticHandler("mustache.js"));
fu.get("/views.js", fu.staticHandler("views.js"));

// lets client send message to server
fu.get("/send_message", function (req, res) {
	var message = qs.parse(url.parse(req.url).query).message;
        getLastTenMessages(res, message);
});

// lets client show all existing messages
fu.get("/get_messages", function (req, res) {
        getExistingMessages(res);
});

function initialSetup() {
	sys.puts("Booting up...");
}

//******** REDIS magic starts here *************//

function getExistingMessages(res) {
        var redisClient = new redis.Client();
        redisClient.exists('messages', function (err, value) {
                if(value == 0) {
			res.simpleJSON(200, {});
		}
		else {
        		redisClient.lrange('messages', 0, 9, function (err, values) {
				var x;
				for(var i=0; i < values.length; i++) {
					x = (i == 0 ? '[ "' + values[0] + '"' : x + ', "' + values[i] + '"');
				}
				x += ' ]';
				redisClient.close();
				res.simpleJSON(200, { message: x });
			});
		}
        });

}

function getLastTenMessages(res, message) {
        var redisClient = new redis.Client();
        redisClient.lpush('messages', message, function (err, value) {
        	redisClient.lrange('messages', 0, 9, function (err, values) {
			var x;
			for(var i=0; i < values.length; i++) {
				x = (i == 0 ? '[ "' + values[0] + '"' : x + ', "' + values[i] + '"');
			}
			x += ' ]';
	        	redisClient.ltrim('messages', 0, 9, function (err, values) {
                		redisClient.close();
				res.simpleJSON(200, { message: x });
			});
		});
        });
}

