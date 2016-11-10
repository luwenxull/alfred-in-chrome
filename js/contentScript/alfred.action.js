/*策略*/
var strategies={
    google:function(content){
        chrome.runtime.sendMessage({type:'google',content:content},function(res){
            displayContent(res)
        });
    },
    collins:function(content){
        chrome.runtime.sendMessage({type:'collins',content:content},function(res){
            displayContent(res)
        });
    },
    bookmarks:function(content){
        chrome.runtime.sendMessage({type:'bookmarks',content:content},function(res){
            displayContent(res)
        });
    },
    filter:function(filterItems){
        displayContent(filterItems,true)
    },
    open:function(content){
        var reg=/https{0,1}:\/\//i;
        if(!reg.test(content)){
            content='http://'+content
        }
        chrome.runtime.sendMessage({type:'open',content:content},function(res){
        });
    }
}

/*策略分发对象*/
var actionDeliver = {
    do: function (type,value) {
        strategies[type].call(null, value)
    }
}

var allActionTypes=['google','collins','bookmarks','gg','cl','bm'];

var contentTemplate="<div class='stage-item' data-href='$$href'><img class='item-icon' src='$$1'/><div class='item-text'><p class='text-title'>$$2</p><p class='text-subtitle'>$$3</p></div></div>"

function displayContent(json,filter){
    !filter && (_alfred_extension.currentDataDisplay=json);
    
    var TemplateCopy,item;
    var div=document.createElement('div');
    _alfred_extension.alfred_content.innerHTML='';
    for(var i=0;i<json.items.length;i++){
        item=json.items[i],TemplateCopy=contentTemplate;
        TemplateCopy=TemplateCopy.replace('$$1',json.icon);
        TemplateCopy=TemplateCopy.replace('$$2',item.title);
        TemplateCopy=TemplateCopy.replace('$$3',item.subtitle);
        TemplateCopy=TemplateCopy.replace('$$href',item.href || '');
        div.innerHTML=TemplateCopy;
        _alfred_extension.alfred_content.append(div.childNodes[0])
    }
}