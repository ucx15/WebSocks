const BACKEND_ADDR = "localhost";
const BACKEND_PORT = 5000;

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearButton');
const connDiv = document.getElementById('conn-div');
const uuidDiv = document.getElementById('label-uuid');


let clientId = null;


function addMessage(who, text) {

	const msg_cont = document.createElement('div');

	const msg_id   = document.createElement('div');
	const msg_text = document.createElement('div');

	msg_id.classList.add('msg_id');
	msg_text.classList.add('msg_text');
	msg_cont.classList.add('msg_cont');

	msg_id.textContent = who.slice(0, 5);
	msg_text.textContent = text;
	// msg_text.textContent = `${who.slice(0, 5)}: ${text}`;

	msg_cont.appendChild(msg_id);
	msg_cont.appendChild(msg_text);

	messagesDiv.appendChild(msg_cont);
	messageInput.value = '';
}

function sendMessage(msg_text) {
	socket.send(JSON.stringify({ kind: "msg", data: msg_text, sender: clientId }));
}


// Connect to the WebSocket server
const socket = new WebSocket(`ws://${BACKEND_ADDR}:${BACKEND_PORT}`);

socket.addEventListener('open', () => {
	console.log('Connected to the server');
	connDiv.style.backgroundColor = 'green';
});

socket.addEventListener('close', () => {
	console.log('Disconnected from the server');
	connDiv.style.backgroundColor = 'red';
});

// Listen for messages from the server
socket.addEventListener('message', (event) => {
	const data = JSON.parse(event.data);

	if (data.kind === 'hello') {
		uuidDiv.textContent = `${data.clientId}`;
		clientId = data.clientId;
		return;
	}

	if (data.kind === 'msg') {
		addMessage(data.sender, data.data);
		return;
	}
});


// Interface
sendButton.addEventListener('click', () => {
	const message = messageInput.value;
	if (message) {
		addMessage(clientId, message);  // update GUI
		sendMessage(message); // send message to server
	}
});

messageInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		const message = messageInput.value;
		if (message) {
			addMessage(clientId, message);  // update GUI
			sendMessage(message); // send message to server
		}
	}
});

clearButton.addEventListener('click', () => {
	messagesDiv.innerHTML = '';
});
