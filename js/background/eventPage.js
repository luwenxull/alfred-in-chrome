var strategies = {
    g: function (value) {
        return 'google'
    },
    o: function(value){
        chrome.tabs.create({
            url:value
        })
    },
    "append_input":function(){
        console.log('ai');
    }
}

chrome.runtime.onMessage.addListener(function (request,sender,response) {
    console.log(request);
    // var type = request.type,
    //     content = request.content;
    //     response(strategies[type].call(null,content))
});