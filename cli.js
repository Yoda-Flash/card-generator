import dotenv from 'dotenv';
import fs from 'fs';
import {parseArgs} from 'node:util';
import * as readline from "node:readline";

class CLI {
    constructor() {
        dotenv.config();
        this.prompted = false;
    }

    prompt_running = async () => {
        while (this.prompted) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    generate = async (prompt) => {
        this.prompted = true;
        let url = `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

        let response = await fetch(
            url, {
                mode: "cors",
                credentials: "include",
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${process.env.API_KEY}`,
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
        let buffer = Buffer.from(image, 'base64');
        fs.writeFileSync("image.jpeg", buffer);
        this.prompted = false;
        return "Card written to image.jpeg!";
    }
}

async function main() {
    const cli = new CLI();
    const argOptions = {
        prompt: {type: 'string', short: 'p', default: ''}
    }
    const args = parseArgs({options: argOptions});
    if (args.values.prompt !== '') {
        console.log(await cli.generate(args.values.prompt).catch(err => console.log(err)));
        await cli.prompt_running();
        process.exit(0)
    }

    let running = true;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (running) {
        rl.question("Insert prompt: ", (prompt) => {
            if (prompt === "stop") {
                running = false;
                cli.prompted = false;
                return;
            }
            cli.generate(prompt).catch(err => console.log(err));
        })

        cli.prompted = true;
        await cli.prompt_running();
        console.log("Card written to image.jpeg!");
    }
    process.exit(0);
}

main().catch(err => console.log(err));