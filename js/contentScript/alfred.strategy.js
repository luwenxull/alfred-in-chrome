var strategies={
    g:function(content){
        chrome.runtime.sendMessage({type:'g',content:content},function(res){
            console.log(res);
        });
    },
    o:function(content){
        var reg=/https{0,1}:\/\//i;
        if(!reg.test(content)){
            content='http://'+content
        }
        chrome.runtime.sendMessage({type:'o',content:content},function(res){
            // console.log(res);
        });
    }
}