import { getActiveTabURL } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarks, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";
    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className="bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes("play",onPlay, controlsElement);
    setBookmarkAttributes("delete",onDelete, controlsElement)

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement)

    bookmarks.appendChild(newBookmarkElement)
    };

    const viewBookmarks = (currentBookmarks=[]) => {
        const bookmarksElement = document.getElementById("bookmarks");
        bookmarksElement.innerHTML = "";

        if(currentBookmarks.length > 0){
            for (let i=0; i < currentBookmarks.length; i++){
                const bookmark = currentBookmarks[i];
                addNewBookmark(bookmarksElement, bookmark)
            }
        } 
        else{
            bookmarksElement.innerHTML = '<i class = "row">No bookmarks to show</i>'
        }
        return;
    };
    const onPlay = async e => {
        const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
        const activeTab= await getActiveTabURL();
        chrome.tabs.sendMessage(activeTab.id, {
            type: "PLAY",
            value: bookmarkTime,
        });

    };
    const onDelete = async e =>{
        const activeTab= await getActiveTabURL();
        const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
        const bookmarkElementToDelete = document.getElementById("bookmark-"+ bookmarkTime);
        bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
        chrome.tabs.sendMessage(activeTab.id, {
            type: "DELETE",
            value: bookmarkTime
        } , viewBookmarks) // takes a callback function, refreshes the bookmarks to show immediate deletion
    };
    const setBookmarkAttributes = (src, eventListener, controlParentElement) => {   // takes source element and event listener and control elemnt i.e. play and del
        const controlElement = document.createElement("img");
        controlElement.src = "assets/" + src +".png";
        controlElement.title = src;
        controlElement.addEventListener("click", eventListener);
        controlParentElement.appendChild(controlElement)   // a container which contains control elements
    };
document.addEventListener("DOMContentLoaded", async () => {     // netive window event, fires when an HTML doc has initially been loaded -> when we want to load all our bookamrks and show them 
        const activeTab = await getActiveTabURL()
        const queryParameters = activeTab.url.split("?")[1];
        const urlParamters = new URLSearchParams(queryParameters);
        const currentVideo = urlParamters.get("v");
        if (activeTab.url.includes("youtube.com/watch") && currentVideo){
            chrome.storage.sync.get([currentVideo], (data) => { // using chrome storage API to get all the bookmarks by sending the video id
                const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]):[];
                viewBookmarks(currentVideoBookmarks)
            })
        }
        else{
            const container = document.getElementsByClassName("container")[0]  // to get the first element of container class -> from popup.html document 
            container.innerHTML = '<div class = "title">This is not a youtube video page.</div>'
        }
}); 