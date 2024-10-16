const characters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9","~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?",
"/"];

function getRandomChar(){
    return characters[(Math.floor(characters.length * Math.random()))]
}

function generatePwd(len){
    let pwd = ""
    for(let i = 0; i < len; i++){
        pwd+= getRandomChar()
    }
    return pwd
}

let pwdlen = 15
let pwd1 = ""
let pwd2 = ""

let pwd1El = document.getElementById("pwd1")
let pwd2El = document.getElementById("pwd2")
let pwdlenEl = document.getElementById("pwdlen")

function setPwds(){
    pwdlen = parseInt(pwdlenEl.value, 10)
    pwd1 = generatePwd(pwdlen)
    pwd2 = generatePwd(pwdlen)
    pwd1El.innerText = pwd1
    pwd2El.innerText = pwd2
}


// Note to self: would be a good idea to understand how to implement error checking/running whenever user presses enter?