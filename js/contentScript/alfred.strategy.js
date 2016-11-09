var strategies={
    google:function(content){
        chrome.runtime.sendMessage({type:'google',content:content},function(res){
            displayContent(res)
        });
    },
    collins:function(content){
        chrome.runtime.sendMessage({type:'collins',content:content},function(res){
            displayContent(res)
            // console.log(res);
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

var allActionTypes=['google','collins'];

var contentTemplate="<div class='stage-item'><img class='item-icon' src='$$1'/><div class='item-text'><p class='text-title'>$$2</p><p class='text-subtitle'>$$3</p></div></div>"

function displayContent(json){
    var TemplateCopy,item;
    var div=document.createElement('div');
    _alfred_extension.alfred_content.innerHTML='';
    for(var i=0;i<json.items.length;i++){
        item=json.items[i],TemplateCopy=contentTemplate;
        TemplateCopy=TemplateCopy.replace('$$1',json.icon);
        TemplateCopy=TemplateCopy.replace('$$2',item.title);
        TemplateCopy=TemplateCopy.replace('$$3',item.subtitle);
        div.innerHTML=TemplateCopy;
        _alfred_extension.alfred_content.append(div.childNodes[0])
    }
}