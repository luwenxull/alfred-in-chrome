var strategies={
    g:function(value){
        chrome.runtime.sendMessage({type:'g',value:value},function(res){
            console.log(res);
        });
    },
    b:{

    }
}