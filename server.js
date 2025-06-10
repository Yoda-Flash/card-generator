import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.options('*name', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "GET, HEAD, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));

})
app.get('/haha', (req, res) => {
    res.send("hehe")
})

app.listen(PORT, (err) => {
    if (!err) console.log("Server running");
});