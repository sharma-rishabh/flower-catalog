const fs = require('fs');
const { createApp } = require('./src/app.js');

const app = createApp(process.env, console.log, fs);
app.listen(4444, () => { console.log('listening on http://localhost:4444'); });
