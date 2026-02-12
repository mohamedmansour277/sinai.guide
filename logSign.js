const logChoice = document.querySelector('.loginChoise');
const signChoice = document.querySelector('.signChoise');
const bgSlide = document.querySelector('.backgroundSL');
const loginSec = document.querySelector('.loginSec');
const signSec = document.querySelector('.signSec');

signChoice.onclick = (e) => {
    e.preventDefault();
    bgSlide.style.left = "50%";
    loginSec.style.display = "none";
    signSec.style.display = "flex";
    document.querySelector('.signa').style.color = "white";
    document.querySelector('.loga').style.color = "var(--mainColor)";
}

logChoice.onclick = (e) => {
    e.preventDefault();
    bgSlide.style.left = "0%";
    signSec.style.display = "none";
    loginSec.style.display = "flex";
    document.querySelector('.loga').style.color = "white";
    document.querySelector('.signa').style.color = "var(--mainColor)";
}