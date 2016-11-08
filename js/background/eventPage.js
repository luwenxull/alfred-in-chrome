var strategies = {
    g: function (value) {
        return 'google'
    },
    b: {

    }
}

chrome.runtime.onMessage.addListener(function (request,sender,response) {
    var type = request.type,
        content = request.content;
        response(strategies[type].call(null,content))
});