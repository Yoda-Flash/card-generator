import dotenv from "dotenv";
import {Image_Generator} from "./image_generator.js";

let imageGenerator = new Image_Generator();
let accountID = document.getElementById('account-id');
let apiKey = document.getElementById('api-key');
let occasion = document.getElementById('occasion');
let recipientName = document.getElementById('name');
let color = document.getElementById('color');
let likes = document.getElementById('likes');
let generateButton = document.getElementById('generate');
let image = document.getElementById('image');
let downloadButton = document.getElementById('download');
let formattedLikes = '';
dotenv.config();

generateButton.onclick = () => {
    imageGenerator.generate(createPromptFromInputs(), getAccountID(), getAPIKEY())
}

let createPromptFromInputs = () => {
    return `Please generate a ${color} ${occasion} card for ${recipientName}, who likes ${formattedLikes}.`;
}

let getAccountID = () => {
    if (accountID.value !== '') {
        return accountID.value;
    } else return process.env.ACCOUNT;
}
