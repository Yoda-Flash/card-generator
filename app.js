// import {Image_Generator} from "./image_generator.js";

// let imageGenerator = new Image_Generator();
let switchTheme = document.getElementById('switch-theme');
let toggleTheme = document.getElementById('toggle-theme');
let themes = ["light", "dark", "cupcake", "synthwave", "valentine", "aqua", "fantasy", "night", "winter", "caramellatte", "abyss"];
let themesCounter = 0;

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

// generateButton.onclick = () => {
//     imageGenerator.generate(createPromptFromInputs(), getAccountID(), getAPIKEY())
// }

switchTheme.onclick = () => {
    document.querySelector('html').setAttribute('data-theme', themes[themesCounter]);
    themesCounter += 1;
    if (themesCounter === themes.length){
        themesCounter = 0;
    }
}

let createPromptFromInputs = () => {
    return `Please generate a ${color} ${occasion} card for ${recipientName}, who likes ${formattedLikes}.`;
}

let getAccountID = () => {
    if (accountID.value !== '') {
        return accountID.value;
    } else return "none";
}

let getAPIKEY = () => {
    if (apiKey.value !== '') {
        return apiKey.value;
    } else return "none";
}
