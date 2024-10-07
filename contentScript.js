// // to manipulate the DOM of the webpage we are on, so this code in contentScript.js has to be in the context of the webpage we are on 

// (() =>{
//     let youtubeLeftControls, youtubePlayer;
//     let currentVideo = "";
//     let currentVideoBookmarks = []; // array to store current video bookmarks

//     // fecth all bookmarks asynchronously when a video is loaded-> it returns a promise to resolve asynchronously
//     const fetchBookmarks = () => {
//         return new Promise((resolve) => {
//             chrome.storage.sync.get([currentVideo],(obj) => {
//                 resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]): [])  // to find bookmarks while indexing current video and return an emoty array when current video not in storage
//             });
//         });
//     };
//     const newVideoLoaded = async() => {
//         const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
//         currentVideoBookmarks = await fetchBookmarks();
//         if(!bookmarkBtnExists){
//             const bookmarkBtn = document.createElement("img");  // create an img element on the yt player 
            
//             bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
//             bookmarkBtn.className = "ytp-button " + "bookmark-btn";
//             bookmarkBtn.title = "Click to bookmark current timestamp"; 

//             youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
//             youtubePlayer = document.getElementsByClassName('video-stream')[0];

//             youtubeLeftControls.appendChild(bookmarkBtn); // to append the bookmark button in the controls
//             bookmarkBtn.addEventListener("click",addNewBookmarkEventHandler);
//         }
//     };// to check if any bookmark already exists, checks className in document
//     // const addNewBookmarkEventHandler = async () =>{
//     //     const currentTime = youtubePlayer.currentTime;   // return the timestamp in seconds
//     //     const description = prompt("Enter description for the bookmark");
//     //     if (description == null){
//     //         return;
//     //     }
//     //     const newBookmark = {      // creating a newBookmark variable
//     //         time : currentTime,
//     //         desc: description ? description : "Bookmark at " + getTime(currentTime),

//     //     };

//     //     currentVideoBookmarks = await fetchBookmarks();
//     //     chrome.storage.sync.set({       // store the bookmarks in JSON format in chrome storage
//     //         [currentVideo] : JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a,b) => a.time - b.time))   // append a new bookmark to the array of bookmarks and sort acc to their time
//     //     });
//     // };
//     // newVideoLoaded();

//     const addNewBookmarkEventHandler = async () => {
//         const currentTime = youtubePlayer.currentTime;   // return the timestamp in seconds
    
//         // Create a floating input box if it doesn't exist
//         let inputBox = document.getElementById('bookmarkInputBox');
//         if (!inputBox) {
//             inputBox = document.createElement('div');
//             inputBox.id = 'bookmarkInputBox';
//             inputBox.innerHTML = `
//                 <input type="text" id="bookmarkDesc" placeholder="Enter description">
//                 <button id="saveBookmark">Save</button>
//             `;
//             inputBox.style.position = 'relative';
//             inputBox.style.top = '10px';
//             inputBox.style.right = '10px';
//             inputBox.style.backgroundColor = 'white';
//             inputBox.style.border = '1px solid #ccc';
//             inputBox.style.padding = '10px';
//             youtubeLeftControls.appendChild(inputBox);
    
//             // Add event listener for saving the bookmark
//             document.getElementById('saveBookmark').addEventListener('click', () => {
//                 const description = document.getElementById('bookmarkDesc').value;
//                 saveBookmark(currentTime, description);
//                 youtubeLeftControls.removeChild(inputBox); // Remove the input box after saving
//             });
//         }
//     };
    
//     const saveBookmark = async (currentTime, description) => {
//         const newBookmark = {
//             time: currentTime,
//             desc: description ? description : "Bookmark at " + getTime(currentTime),
//     };

//     currentVideoBookmarks = await fetchBookmarks();
//     chrome.storage.sync.set({
//         [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
//     });
// };
    
    
    
    
    
    
    
    


// // chrome listens to receive message
// chrome.runtime.onMessage.addListener((obj, sender, response) =>{
//     const { type, value, videoId} = obj;  // destructure the obj from the message received 
//     if(type === "NEW"){
//         //currentVideo global variable
//         currentVideo = videoId;
//         newVideoLoaded();
//     } else if (type==="PLAY"){
//         youtubePlayer.currentTime = value;
//     }
//     else if (type==="DELETE"){
//         currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
//         chrome.storage.sync.set({[currentVideo]: JSON.stringify(currentVideoBookmarks)});
//         response(currentVideoBookmarks);
//     }
// }); 
// })();

// const getTime = t => {
//     var date = new Date(0);
//     date.setSeconds(t);
//     return date.toISOString().substr(11,8);
// }




(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    // Function to fetch bookmarks
    const fetchBookmarks = () => {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get([currentVideo], (obj) => {
                    resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
                });
            } catch (error) {
                reject(new Error("Extension context invalidated."));
            }
        });
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;

        let inputBox = document.getElementById("bookmarkInputBox");
        if (!inputBox) {
            inputBox = document.createElement("div");
            inputBox.id = "bookmarkInputBox";
            inputBox.innerHTML = `
                <input type="text" id="bookmarkDesc" placeholder="Enter description">
                <button id="saveBookmark">Save</button>
            `;
            inputBox.style.position = 'relative';
            inputBox.style.top = '10px';
            inputBox.style.right = '10px';
            inputBox.style.backgroundColor = 'white';
            inputBox.style.border = '1px solid #ccc';
            inputBox.style.padding = '10px';
            youtubeLeftControls.appendChild(inputBox);

            document.getElementById("saveBookmark").addEventListener("click", () => {
                const description = document.getElementById("bookmarkDesc").value;
                saveBookmark(currentTime, description);
                youtubeLeftControls.removeChild(inputBox);
            });
        }
    };

    const saveBookmark = async (currentTime, description) => {
        currentVideoBookmarks = await fetchBookmarks();
        const newBookmark = {
            time: currentTime,
            desc: description ? description : "Bookmark at " + getTime(currentTime),
        };

        try {
            await chrome.storage.sync.set({
                [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)),
            });
        } catch (error) {
            console.error("Failed to save bookmark:", error);
        }
    };

    // Listen for messages
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if (type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
            response(currentVideoBookmarks);
        }
    });
})();

