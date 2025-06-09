import dotenv from 'dotenv';
import fs from 'fs';
import cloudflare, {Cloudflare} from 'cloudflare';

export class Image_Generator {
    constructor() {
        dotenv.config();
    }

    generate = async (prompt, username, api_key) => {
        let client = new Cloudflare(api_key)

        let response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${username}/ai/run/@cf/black-forest-labs/flux-1-schnell/`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                },
                body: JSON.stringify({
                    "prompt": prompt,
                    "seed": Math.floor(Math.random() * 10)
                    // "messages":[{
                    //     "role": "system",
                    //     "content": "You are a friendly assistant that helps create cards as gifts for people for all sorts of occasions."
                    // }, {
                    //     "role": "user",
                    //     "content": prompt
                    // }]
                })
            }
        )

        let text = await response.text();
        let image = JSON.parse(text).result.image;
        let buffer = Buffer.from(image, 'base64');

        fs.writeFileSync("image.jpeg", buffer);

        return new Response(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });
    }


}

async function main() {
    const imageGenerator = new Image_Generator();
    await imageGenerator.generate("Please generate a green Father's Day day card for Patrick, who likes money and gold.", process.env.ACCOUNT, process.env.API_KEY).catch(err => console.log(err));
}

main().catch(err => console.log(err));