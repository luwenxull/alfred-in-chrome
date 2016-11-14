var regexer = {
    web: /\.{0,1}\w+\.\w+.*/
}

/*策略*/
var strategies = {
    set: function (content) {
        _alfred_extension.loading();
        chrome.runtime.sendMessage({
            type: 'set',
            content: content
        }, function (res) {
            prepareStage(res)
        });
    },
    google: function (content) {
        chrome.runtime.sendMessage({
            type: 'google',
            content: content
        }, function (res) {
            // _alfred_extension.display();
        });
    },
    baidu: function (content) {
        chrome.runtime.sendMessage({
            type: 'baidu',
            content: content
        }, function (res) {
            // _alfred_extension.display();
        });
    },
    collins: function (content) {
        _alfred_extension.loading();
        chrome.runtime.sendMessage({
            type: 'collins',
            content: content
        }, function (res) {
            prepareStage(res)
        });
    },
    bookmarks: function (content) {
        _alfred_extension.loading();
        chrome.runtime.sendMessage({
            type: 'bookmarks',
            content: content
        }, function (res) {
            prepareStage(res)
        });
    },
    filter: function (filterItems) {
        prepareStage(filterItems, true)
    },
    go: function (content) {
        var reg = /https{0,1}:\/\//i;
        if (!reg.test(content)) {
            content = 'http://' + content
        }
        chrome.runtime.sendMessage({
            type: 'go',
            content: content
        }, function (res) {
            // _alfred_extension.display();
        });
    },
    getHistory: function (content) {
        _alfred_extension.loading();
        chrome.runtime.sendMessage({
            type: 'getHistory',
            content: content
        }, function (res) {
            prepareStage(res)
        });
    },
    setHistory: function (content) {
        if (regexer.web.test(content)) {
            chrome.runtime.sendMessage({
                type: 'setHistory',
                content: content
            }, function (res) {
                // _alfred_extension.display();
            });
        }
    },
    bus: function (content) {
        _alfred_extension.loading();
        chrome.runtime.sendMessage({
            type: 'bus',
            content: content
        }, function (res) {
            prepareStage(res)
        });
    }
}

/*策略分发对象*/
var actionDeliver = {
    do: function (type, value) {
        // _alfred_extension.loading(); //显示loading
        // _alfred_extension.domReference.stage.innerHTML=''; //同时清空当前显示项
        strategies[type].call(null, value)
    }
}

var allActionTypes = ['google', 'collins', 'bookmarks', 'go', 'bus', 'baidu', 'set'];

var contentTemplate = "<div class='alfred-stage-item' data-href='$$href'><img class='alfred-item-icon' src='$$1'/><div class='alfred-item-text'><p class='alfred-text-title'>$$2</p><p class='alfred-text-subtitle'>$$3</p></div></div>"

function displayContent(json, filter) {
    var TemplateCopy, item;
    var stage = _alfred_extension.domReference.stage,
        $s = $(stage);

    var l = json.items.length;
    for (var i = 0; i < l; i++) {
        item = json.items[i], TemplateCopy = contentTemplate;
        TemplateCopy = TemplateCopy.replace('$$1', item.icon || json.icon);
        TemplateCopy = TemplateCopy.replace('$$2', item.title);
        TemplateCopy = TemplateCopy.replace('$$3', item.subtitle);
        TemplateCopy = TemplateCopy.replace('$$href', item.href || '');
        $s.append(TemplateCopy)
    }
}


function prepareStage(json, filter) {
    _alfred_extension.display(); //切换为非加载模式

    !filter && (_alfred_extension.currentDataDisplay = json);

    _alfred_extension.domReference.stage.innerHTML = ''; //清空当前显示项
    if (json && json.items) {
        if (json.items.length) {
            _alfred_extension.domReference.input.classList.add('half-border')
        } else {
            _alfred_extension.domReference.input.classList.remove('half-border')
        }
        displayContent(json, filter);
    }
}