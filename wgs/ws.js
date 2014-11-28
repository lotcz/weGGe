var ws = require("nodejs-websocket")

var server = ws.createServer(function (connection) {
	connection.nickname = false;
	connection.lastmsg = false;
    console.log("New connection")
    connection.on("text", function (msg) {
        if (!connection.nickname) {
			connection.nickname = JSON.parse(msg).nick;
			init(connection)
			console.log(connection.nickname + " entered")			
		} else {
			connection.lastmsg = msg;
		}
		broadcast(connection, msg)
    })
    connection.on("close", function (code, reason) {
		if (this.nickname) {
			console.log(this.nickname + " - connection closed")
		} else {
			console.log("anonymous connection closed")
		}
    })
}).listen(8001)

function broadcast(connection, msg) {
	server.connections.forEach(function (client) {
		if (connection !== client) {
			client.sendText("{\"nick\":\""+connection.nickname+"\", \"json\":"+msg+"}")
		}
	})
}

function init(connection) {
	server.connections.forEach(function (client) {
		if (connection !== client) {
			if (client.nickname) {
				if (client.lastmsg) {
					connection.sendText("{\"nick\":\""+client.nickname+"\", \"json\":"+client.lastmsg+"}")
				} else {
					connection.sendText("{\"nick\":\""+client.nickname+"\"}")
				}
			}
		}
	})
}