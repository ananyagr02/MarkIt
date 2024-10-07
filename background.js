// to listen to any updates in the tabs and find the tab we are on currently so that if its a youtube tab then action can be performed
//using chrome.tabs API
chrome.tabs.onUpdated.addListener((tabId, tab) =>{
    if(tab.url && tab.url.includes("youtube.com/watch")) { // if the tab has a url and if the url is of youtube
        const queryParameters =  tab.url.split("?")[1];
        // we use queryParamters as a unique id for each video so we get it from storage  youtube.com/watch?v=0n809nd4Zu4 here v=.... means unique id of the video being played on the current yt tab
        const urlParamters = new URLSearchParams(queryParameters);

        // send Message methode from the documentation
        // sendMessage takes tabId, an object and also can take a callback function
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",  // telling that its a new event(video) and send its id = v
            videoId: urlParamters.get("v")
        })
    }
})