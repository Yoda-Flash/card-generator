import {Image_Generator} from "./image_generator.js";

let imageGenerator = new Image_Generator();
let switchTheme = document.getElementById('switch-theme');
let themes = ["light", "cupcake", "synthwave", "valentine", "aqua", "fantasy", "night", "winter", "caramellatte", "abyss"];
let themesCounter = 0;

let accountID = document.getElementById('account-id');
let apiKey = document.getElementById('api-key');
let generateButton = document.getElementById('generate');
let image = document.getElementById('image');
let downloadButton = document.getElementById('download');

let likesArray = [];
let formattedLikes = '';

let prompt = '';

generateButton.onclick = async () => {
    let imageURL = await imageGenerator.generate(createPromptFromInputs(), getAccountID(), getAPIKEY(), getServerMode()).catch(err => console.log(err));
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

downloadButton.onclick = () => {
    let link = document.createElement('a');
    link.setAttribute('href', image.src);
    link.setAttribute('download', "image.jpeg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

let createPromptFromInputs = () => {
    let occasion = document.getElementById('occasion').value.toLowerCase();
    let recipientName = document.getElementById('name').value.toLowerCase();
    let color = document.getElementById('color').value.toLowerCase();
    let likes = document.getElementById('likes').value.toLowerCase().replaceAll(" ", "");
    if (likes !== '') {
        prompt = `Please generate a ${color} ${occasion} card for ${recipientName}, who likes ${formatLikes(likes)}.`;
    } else {
        prompt = `Please generate a ${color} ${occasion} card for ${recipientName}.`;
    }
    console.log(prompt);
    return prompt;
}

let formatLikes = (likes) => {
    likesArray = [];
    formattedLikes = '';
    console.log(likes);
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
        console.log(accountID.value);
        return accountID.value;
    } else return "none";
}

let getAPIKEY = () => {
    if (apiKey.value !== '') {
        return apiKey.value;
    } else return "none";
}

let getServerMode = () => {
    let mode =  document.getElementById('mode');
    return mode.value;
}

