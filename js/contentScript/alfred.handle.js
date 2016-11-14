function moveActive(key) {
    var stage_items = document.querySelectorAll('.stage-item'),
        l = stage_items.length;
    if (stage_items) {
        var currentActiveIndex = -1;
        for (var i = 0; i < l; i++) {
            var si = stage_items[i];
            if (si.classList.contains('active')) {
                si.classList.remove('active');
                currentActiveIndex = i
            }
        }

        if (key.toLowerCase() == 'arrowdown' || key == ']') currentActiveIndex++;
        else currentActiveIndex--;

        if (currentActiveIndex < 0) currentActiveIndex = 0;
        if (currentActiveIndex >= l) currentActiveIndex = l - 1;

        var activeItem = stage_items[currentActiveIndex];
        if (activeItem) {
            activeItem.classList.add('active');
            activeItem.scrollIntoView();
            activeItem.focus();
            _alfred_extension.currentActiveItem = activeItem;
        }
    }
}


var Handle = function (fn) {
    this.do = fn;
};

Handle.prototype.setNext = function (handle) {
    return this.next = handle
};

function transformActionAbbr(abbr) {
    switch (abbr) {
        case 'gg':
            return 'google'
        case 'cl':
            return 'collins'
        case 'bm':
            return 'bookmarks'
        case 'bd':
            return 'baidu'
        default:
            return abbr
    }
}

function filterByValue(value) {
    if (_alfred_extension.mode == alfred_mode.SEARCH && _alfred_extension.currentDataDisplay) {
        var items = _alfred_extension.currentDataDisplay.items;
        var item, filterItems = []
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            if (item.title.toLowerCase().search(value) != -1) {
                filterItems.push(item)
            }
        }

        actionDeliver.do('filter', {
            icon: _alfred_extension.currentDataDisplay.icon,
            items: filterItems
        });

        _alfred_extension.currentActiveItem=null;
    }
}


var enterStrategies = {};
enterStrategies[alfred_mode.NORMAL] = function (type, input) {
    var value = input.value;
    if (type) {
        _alfred_extension.inputHistory.add(value);
        actionDeliver.do(type, value);
    } else {
        type = transformActionAbbr(value);
        _alfred_extension.setActionType(type);
        input.value = '';
        if (type == 'bookmarks') {
            actionDeliver.do(type);
            _alfred_extension.mode = alfred_mode.SEARCH
        }
        if (type == 'go') {
            actionDeliver.do('getHistory');
            _alfred_extension.mode = alfred_mode.SEARCH
        }
    }
};

enterStrategies[alfred_mode.SEARCH] = function (type, input) {
    var href;
    if (type == 'go') {
        href = input.value;
        actionDeliver.do('setHistory',href);
    }
    if (_alfred_extension.currentActiveItem) {
        href = _alfred_extension.currentActiveItem.getAttribute('data-href');
    }
    if (href) {
        actionDeliver.do('go', href)
    }
};

var enterDeliver = function (input) {
    enterStrategies[_alfred_extension.mode].call(null, _alfred_extension.currentActionType, input)
};

var handle_enter = new Handle(function (key, input) {
    var mode = _alfred_extension.mode;
    if (key.toLowerCase() == 'enter') {
        enterDeliver(input);
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

function noVal(value) {
    return value === '' || value === undefined || value === null
}

var handle_backspace = new Handle(function (key, input, e) {
    if (key.toLowerCase() == 'backspace' && e.shiftKey) {
        _alfred_extension.clear();
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

var handle_arrow = new Handle(function (key, input, e) {
    if (key.toLowerCase() == 'arrowdown' || key.toLowerCase() == 'arrowup' || key == '[' || key == ']') {
        moveActive(key);
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

var handle_escape = new Handle(function (key, input, e) {
    var alt = e.altKey;
    if (key == '.' && alt) {
        _alfred_extension.close()
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

function ifInputChanged(value) {
    return value === _alfred_extension.inputHistory.getLast();
}

function resetMode(value, type) {
    if (ifInputChanged(value)) {
        if (type == 'bookmarks') {
            _alfred_extension.mode = alfred_mode.SEARCH
        } else {
            _alfred_extension.mode = alfred_mode.NORMAL
        }
    }
}
var handle_default = new Handle(function (key, input, e) {
    var value = input.value,
        type = _alfred_extension.currentActionType;
    filterByValue(value);
});

handle_enter.setNext(handle_backspace).setNext(handle_arrow).setNext(handle_escape).setNext(handle_default)