//express server
const express = require('express');

let PORT = 3000

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
