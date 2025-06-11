// import dotenv from 'dotenv';
// import fs from 'fs';

import {getAccount, getApiKey} from "./secrets.js";

export class Image_Generator {
    constructor() {
        // dotenv.config();
    }

    async fetch(request) {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
            "Access-Control-Max-Age": "86400"
        };

        const API_URL = request.url;
        const PROXY_ENDPOINT = "/corsproxy/";

        async function handleRequest(request, prompt) {
            let url = new URL(request.url);
            let apiUrl = url.searchParams.get("apiurl");

            if (apiUrl == null) {
                apiUrl = API_URL;
            }

            request = new Request(apiUrl, request);
            request.headers.set("Origin", new URL(apiUrl).origin);
            let response = await fetch(request);

            response = new Response(response.body, response);

            response.headers.set("Access-Control-Allow-Origin", url.origin);
            response.headers.append("Vary", "Origin");

            console.log(response);
            return response;
        }

        async function handleOptions(request) {
            if (
                request.headers.get("Origin") !== null &&
                request.headers.get("Access-Control-Request-Method") !== null &&
                request.headers.get("Access-Control-Request-Headers") !== null
            ) {
                return new Response(null, {
                    headers: {
                        ...corsHeaders,
                        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers")
                    }
                })
            } else {
                return new Response(null, {
                    headers: {
                        Allow: "GET, HEAD, POST, OPTIONS"
                    }
                })
            }
        }

        const request_url = new URL(request.url);
        if (request_url.pathname.startsWith(PROXY_ENDPOINT)) {
            if (request.method === "OPTIONS") {
                return handleOptions(request);
            }
        } else if (
            request.method === "GET" ||
            request.method === "HEAD" ||
            request.method === "POST"
        ) {
            return handleRequest(request);
        }
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

        const PROXY_ENDPOINT = "/corsproxy/";

        const URL = `https://api.cloudflare.com/client/v4/accounts/${username}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

        let href = `${PROXY_ENDPOINT}?apiurl=${URL}`;

        let proxy = async () => {
            return fetch(window.location.origin + href).then(r => r.json);
        }

        let proxypreflight = async () => {
            let response = await fetch(window.location.origin + href, {
                method: "POST",
                headers: {
                    "Authorization": api_key,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "prompt": prompt,
                    "seed": Math.floor(Math.random() * 10)
                })
            })
            return response.text();
        }

        // let response = await fetch(
        //     url, {
        //         mode: "cors",
        //         credentials: "include",
        //         method: 'POST',
        //         headers: {
        //             "Access-Control-Allow-Origin": new URL(url).origin,
        //             "Access-Control-Expose-Headers": "*",
        //             "Access-Control-Request-Method": "POST",
        //             "Access-Control-Request-Headers": "*",
        //             "Access-Control-Allow-Headers": "*",
        //             "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        //             "Access-Control-Max-Age": 86400,
        //             "Access-Control-Allow-Credentials": true,
        //             "Origin": new URL(url).origin,
        //             "Authorization": `Bearer ${api_key}`,
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify({
        //             "prompt": prompt,
        //             "seed": Math.floor(Math.random() * 10)
        //         })
        //     }
        // ).catch(err => console.log(err));

        let text = await proxypreflight();
        let image = JSON.parse(text).result.image;
        // fs.writeFileSync("image.txt", "data:image/jpeg;base64," + image);
        // return "data:image/jpeg;base64," + image;
        let buffer = Buffer.from(image, 'base64');
        //
        // fs.writeFileSync("image.jpeg", buffer);
        //
        return new Response(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': "*"
            },
        });
    }
}

async function main() {
    const imageGenerator = new Image_Generator();
    console.log(await imageGenerator.generate("Please generate a green Father's Day day card for Patrick, who likes money and gold.", getAccount(), getApiKey()).catch(err => console.log(err)));
}

main().catch(err => console.log(err));