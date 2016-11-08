var strategies = {
    g: function (value) {
        return 'google'
    },
    o: function(value){
        chrome.tabs.create({
            url:value
        })
    }
}

chrome.runtime.onMessage.addListener(function (request,sender,response) {
    var type = request.type,
        content = request.content;
        response(strategies[type].call(null,content))
});