var regexer = {
    web: /\.{0,1}\w+\.\w+.*/
}

/*策略*/
var strategies = {
    set: function (content) {
        chrome.runtime.sendMessage({
            type: 'set',
            content: content
        }, function (res) {
            displayContent(res)
        });
    },
    google: function (content) {
        chrome.runtime.sendMessage({
            type: 'google',
            content: content
        }, function (res) {
            // displayContent(res)
        });
    },
    baidu: function (content) {
        chrome.runtime.sendMessage({
            type: 'baidu',
            content: content
        }, function (res) {
            // displayContent(res)
        });
    },
    collins: function (content) {
        chrome.runtime.sendMessage({
            type: 'collins',
            content: content
        }, function (res) {
            displayContent(res)
        });
    },
    bookmarks: function (content) {
        chrome.runtime.sendMessage({
            type: 'bookmarks',
            content: content
        }, function (res) {
            displayContent(res)
        });
    },
    filter: function (filterItems) {
        displayContent(filterItems, true)
    },
    go: function (content) {
        var reg = /https{0,1}:\/\//i;
        if (!reg.test(content)) {
            content = 'http://' + content
        }
        chrome.runtime.sendMessage({
            type: 'go',
            content: content
        }, function (res) {});
    },
    getHistory: function (content) {
        chrome.runtime.sendMessage({
            type: 'getHistory',
            content: content
        }, function (res) {
            displayContent(res)
        });
    },
    setHistory: function (content) {
        if (regexer.web.test(content)) {
            chrome.runtime.sendMessage({
                type: 'setHistory',
                content: content
            }, function (res) {});
        }
    },
    bus: function (content) {
        chrome.runtime.sendMessage({
            type: 'bus',
            content: content
        }, function (res) {
            displayContent(res)
        });
    }
}

/*策略分发对象*/
var actionDeliver = {
    do: function (type, value) {
        showLoading();//显示loading
        displayContent({items:[]});//同时清空当前显示项
        strategies[type].call(null, value)
    }
}

var allActionTypes = ['google', 'collins', 'bookmarks', 'go', 'bus', 'baidu', 'set'];

var contentTemplate = "<div class='alfred-stage-item' data-href='$$href'><img class='alfred-item-icon' src='$$1'/><div class='alfred-item-text'><p class='alfred-text-title'>$$2</p><p class='alfred-text-subtitle'>$$3</p></div></div>"

function displayContent(json, filter) {
    !filter && (_alfred_extension.currentDataDisplay = json);

    var TemplateCopy, item;
    var stage = _alfred_extension.domReference.stage,
        $s = $(stage);

    stage.innerHTML = '';

    var l = json.items.length;
    if (l) {
        _alfred_extension.domReference.input.classList.add('half-border')
    } else {
        _alfred_extension.domReference.input.classList.remove('half-border')
    }

    for (var i = 0; i < l; i++) {
        item = json.items[i], TemplateCopy = contentTemplate;
        TemplateCopy = TemplateCopy.replace('$$1', item.icon || json.icon);
        TemplateCopy = TemplateCopy.replace('$$2', item.title);
        TemplateCopy = TemplateCopy.replace('$$3', item.subtitle);
        TemplateCopy = TemplateCopy.replace('$$href', item.href || '');
        $s.append(TemplateCopy)
    }
}

function showLoading() {
    var loading = _alfred_extension.domReference.loading;
    loading.style.display = 'block';
     _alfred_extension.domReference.input.classList.add('half-border');
}

function hideLoading() {
    var loading = _alfred_extension.domReference.loading;
    loading.style.display = 'none';
     _alfred_extension.domReference.input.classList.remove('half-border')
}