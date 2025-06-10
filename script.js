import {Image_Generator} from "./image_generator.js";

let imageGenerator = new Image_Generator();
let switchTheme = document.getElementById('switch-theme');
let themes = ["light", "cupcake", "synthwave", "valentine", "aqua", "fantasy", "night", "winter", "caramellatte", "abyss"];
let themesCounter = 0;

let accountID = document.getElementById('account-id').innerText;
let apiKey = document.getElementById('api-key').innerText;
let occasion = document.getElementById('occasion').innerText.toLowerCase();
let recipientName = document.getElementById('name').innerText.toLowerCase();
let color = document.getElementById('color').innerText.toLowerCase();
let likes = document.getElementById('likes').innerText.toLowerCase();
let generateButton = document.getElementById('generate');
let image = document.getElementById('image');
let downloadButton = document.getElementById('download');

let likesArray = [];
let formattedLikes = '';

generateButton.onclick = async () => {
    let imageURL = await imageGenerator.generate(createPromptFromInputs(), getAccountID(), getAPIKEY()).catch(err => console.log(err));
    const response = await fetch(imageURL);
    const imageBlob = await response.blob();
    image.src = URL.createObjectURL(imageBlob);
}

switchTheme.onclick = () => {
    document.querySelector('html').setAttribute('data-theme', themes[themesCounter]);
    themesCounter += 1;
    if (themesCounter === themes.length){
        themesCounter = 0;
    }
}

let createPromptFromInputs = () => {
    return `Please generate a ${color} ${occasion} card for ${recipientName}, who likes ${formatLikes()}.`;
}

let formatLikes = () => {
    likesArray = likes.replaceAll(" ", "").split(",");
    for (let i=0; i<likesArray.length; i++) {
        if ((likesArray.length > 1)) {
            if ((i === likesArray.length - 1)) {
                formattedLikes += `and ${likesArray[i]}`;
            } else {
                formattedLikes += `${likesArray[i]}, `
            }
        } else if ((likesArray.length === 1)) {
            formattedLikes += likesArray[i];
        }
    }
    return formattedLikes;
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
