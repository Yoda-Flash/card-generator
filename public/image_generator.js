// import dotenv from 'dotenv';
// import fs from 'fs';


export class Image_Generator {
    constructor() {
        // dotenv.config();
    }

    generate = async (prompt, account_id, api_key, server_mode) => {

        let image = '';
        let address = '';
        if (server_mode === "Localhost") {
            address = 'http://localhost:37244';
        } else {
            address = 'https://card-generator.yoda-flash.hackclub.app'
        }

        let url = `${address}/image/${prompt}/${account_id}.${api_key}`;

        console.log(url);
        await fetch(
            url, {
                method: "GET"
            }
        ).then(response => response.text().then(result => image = result))
        .catch(err => console.log(err));

        return image;

        // let url = `https://api.cloudflare.com/client/v4/accounts/${username}/ai/run/@cf/black-forest-labs/flux-1-schnell`;
        //
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
        //
        // let text = await response.text();
        // let image = JSON.parse(text).result.image;
        // // fs.writeFileSync("image.txt", "data:image/jpeg;base64," + image);
        // return "data:image/jpeg;base64," + image;
        // let buffer = Buffer.from(image, 'base64');
        //
        // fs.writeFileSync("image.jpeg", buffer);
        //
        // return new Response(buffer, {
        //     headers: {
        //         'Content-Type': 'image/jpeg',
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Headers': "*"
        //     },
        // });
    }
}

// async function main() {
//     const imageGenerator = new Image_Generator();
//     await imageGenerator.generate("Please generate a green Father's Day day card for Patrick, who likes money and gold.", getAccount(), getApiKey()).catch(err => console.log(err));
// }

// main().catch(err => console.log(err));