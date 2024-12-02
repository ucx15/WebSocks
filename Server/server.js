const crypto = require('crypto');
const WebSocket = require('ws');


const PORT = 5000
const wss = new WebSocket.Server({ port: PORT });


function getUUID() {
	return crypto.randomBytes(16).toString("hex");
}


wss.on('connection', (ws) => {
	const clientId = getUUID();
	ws.send(JSON.stringify({ kind: 'hello', clientId }));
	console.log(`Client connected ${clientId}`);

	// Code to handle incoming messages
	ws.on('message', (message) => {
		message = JSON.parse(message)
		if (message.kind === 'msg') {
			// Broadcast the message to all clients but to self
			wss.clients.forEach((client) => {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ kind: 'msg', data: message.data, sender: clientId }));
				}
			});
		}
	});

	ws.on('close', () => {
		console.log(`Client disconnected ${clientId}`);
	});
});
