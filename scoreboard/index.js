let homeScore = 0
let time = 0
homeEl = document.getElementById("home-score")
homeEl.innerText = homeScore
homeBg = document.getElementById("home")

function home_1(){
    homeScore+=1
    homeEl.innerText = homeScore
    highlight(homeScore)
}

function home_2(){
    homeScore+=2
    homeEl.innerText = homeScore
    highlight(homeScore)
}

function home_3(){
    homeScore+=3
    homeEl.innerText = homeScore
    highlight(homeScore)
}
function highlight(homeScore){
    if(homeScore > 5){
        if(homeScore > 5){
            homeBg.style.backgroundColor = "blue"
        }
    }
    else {
        homeBg.style.backgroundColor = "transparent"
    }
}



timerEl = document.getElementById("timer")
setInterval(function() {
    timerEl.innerText = time
    time++
}, 2000);