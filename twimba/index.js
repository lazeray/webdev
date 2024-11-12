import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         set,
         remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://twimba-99cdf-default-rtdb.firebaseio.com/"
}

/*
possible improvements:
only update sections of memory rather than whole tweet object
Login screen? (this seems hard)
graceful handling of multiple people at once
store isHidden using a local variable
legit deployement
*/

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const tweetsDataRef = ref(database, "tweetsData");

let tweetsArray = []
onValue(tweetsDataRef, (snapshot) => {
    const tweetsData = snapshot.val();

    tweetsArray = tweetsData ? Object.values(tweetsData).map(tweet => {
        // Workaround for firebase not storing empty arrays
        if (tweet.replies === undefined) {
            tweet.replies = [];  // Default to empty array
        }
        return tweet;
    }) : [];
    render()
});

function getTweet(tweetId){

    const targetTweetObj = tweetsArray.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    return targetTweetObj
}

function updateTweet(tweetId, tweetObj){ 
    const tweetKey = `tweetsData/${tweetId}`;
    const tweetRef = ref(database, tweetKey);
    set(tweetRef, tweetObj)
}

function addTweet(tweetId, tweetObj){ // This actually does the same thing as updateTweet lol
    const tweetKey = `tweetsData/${tweetId}`;
    const dataRef = ref(database, tweetKey);
    set(dataRef, tweetObj)
    
}

function removeTweet(tweetId){
    const tweetKey = `tweetsData/${tweetId}`;
    const tweetRef = ref(database, tweetKey);
    remove(tweetRef)
}

let myHandle = `@laze`
let myProfile = `images/laze.png`

document.addEventListener('click', function(e){
    
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        console.log("reply clicked!")
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    }
})

document.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
        e.preventDefault();
        if(e.target.dataset.tweetReply){
            handleTweetReply(e.target.dataset.tweetReply, e.target.value)
        }

        e.target.value = ""
    }
})

function handleTweetReply(tweetId, replyText){
    if(replyText !== ""){
        let replyContent = {
            handle: myHandle,
            profilePic: myProfile,
            tweetText: replyText
        }
        const targetTweetObj = getTweet(tweetId)
        targetTweetObj.replies = targetTweetObj.replies.concat(replyContent)
        updateTweet(tweetId, targetTweetObj)
        
    }
}

function handleReplyClick(tweetId){
    const targetTweetObj = getTweet(tweetId)
    targetTweetObj.isHidden = !targetTweetObj.isHidden
    updateTweet(tweetId, targetTweetObj)
}

function handleRemoveClick(tweetId){
    removeTweet(tweetId)
}

function handleLikeClick(tweetId){ 
    const targetTweetObj = getTweet(tweetId)

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    updateTweet(tweetId, targetTweetObj)
}

function handleRetweetClick(tweetId){
    const targetTweetObj = getTweet(tweetId)
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    updateTweet(tweetId, targetTweetObj) 
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        let tweetId = uuidv4()
        let tweetObj = {
            handle: myHandle,
            profilePic: myProfile,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isHidden: true,
            uuid: tweetId
        }
        addTweet(tweetId, tweetObj)

    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    tweetsArray.forEach(function(tweet){
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){  
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        repliesHtml += `<textarea placeholder="Enter reply here!" class="reply-input-area" data-tweet-reply="${tweet.uuid}"></textarea>`
        let buttonhtml = ""
        if(tweet.handle === myHandle){
            buttonhtml = `<button class="delete-btn" data-remove="${tweet.uuid}">X</button>`
        }
        let isHidden = ""
        if(tweet.isHidden === true){
            isHidden = "hidden"
        }
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="tweet-header">
                <p class="handle">${tweet.handle}</p>
                ${buttonhtml}
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="${isHidden}" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}



render()
