// import dotenv from 'dotenv';
// import fs from 'fs';

import {getAccount, getApiKey} from "./secrets.js";

export class Image_Generator {
    constructor() {
        // dotenv.config();
    }

    generate = async (prompt, username, api_key) => {
        if (username === "none") {
            username = getAccount();
            // username = process.env.ACCOUNT;
        }
        if (api_key === "none") {
            api_key = getApiKey();
            // api_key = process.env.API_KEY;
        }

        let url = `https://api.cloudflare.com/client/v4/accounts/${username}/ai/run/@cf/black-forest-labs/flux-1-schnell`;
        let response = await fetch(
            url, {
                mode: "cors",
                credentials: "include",
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": new URL(url).origin,
                    "Access-Control-Expose-Headers": "*",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Max-Age": 86400,
                    "Access-Control-Allow-Credentials": true,
                    "Origin": new URL(url).origin,
                    "Authorization": `Bearer ${api_key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "prompt": prompt,
                    "seed": Math.floor(Math.random() * 10)
                })
            }
        ).catch(err => console.log(err));

        let text = await response.text();
        let image = JSON.parse(text).result.image;
        // fs.writeFileSync("image.txt", "data:image/jpeg;base64," + image);
        return "data:image/jpeg;base64," + image;
        // let buffer = Buffer.from(image, 'base64');
        //
        // fs.writeFileSync("image.jpeg", buffer);
        //
        // return new Response(buffer, {
        //     headers: {
        //         'Content-Type': 'image/jpeg',
        //     },
        // });
    }


}

async function main() {
    const imageGenerator = new Image_Generator();
    console.log(await imageGenerator.generate("Please generate a green Father's Day day card for Patrick, who likes money and gold.", getAccount(), getApiKey()).catch(err => console.log(err)));
}

main().catch(err => console.log(err));