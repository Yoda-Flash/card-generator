import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from "dotenv";
import cors from 'cors';

const app = express();
const PORT = 37244;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

let account_id = '';
let api_key = '';

app.use(cors());
app.use(express.static('public'));

app.options('*name', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "GET, HEAD, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

app.get('/image/:prompt/:account_id.:api_key', async (req, res) => {
    if (req.params.account_id !== 'none') {
        account_id = req.params.account_id;
    } else {
        account_id = process.env.ACCOUNT_ID;
    }

    if (req.params.api_key !== 'none') {
        api_key = req.params.api_key;
    } else {
        api_key = process.env.API_KEY;
    }

    let url = `https://api.cloudflare.com/client/v4/accounts/${account_id}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

    let response = await fetch(
        url, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${api_key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "prompt": req.params.prompt,
                "seed": Math.floor(Math.random() * 10)
            })
        }
    ).catch(err => console.log(err));

    let text = await response.text();

    let image = JSON.parse(text).result.image;
    res.send("data:image/jpeg;base64," + image);

})

app.listen(PORT, (err) => {
    if (!err) console.log("Server running");
});