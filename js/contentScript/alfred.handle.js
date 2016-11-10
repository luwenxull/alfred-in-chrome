function _alfred_moveActive(key) {
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
        activeItem.classList.add('active');
        activeItem.scrollIntoView();
        activeItem.focus();
        _alfred_extension.currentActiveItem = activeItem;
    }
}


function getActionType(value) {
    for (var i = 0; i < allActionTypes.length; i++) {
        var aType = allActionTypes[i]
        if (aType === value) {
            _alfred_extension.alfred_action_img.setAttribute('src', iconConfig[aType]);
            _alfred_extension.alfred_action_img.style.display = "inline";
            return aType
        }
    }
    return void 0;
}


var Handle = function (fn) {
    this.do = fn;
};

Handle.prototype.setNext = function (handle) {
    return this.next = handle
};

function transform(abbr) {
    switch (true) {
        case abbr == 'gg' || abbr == 'google':
            return 'google'
        case abbr == 'cl' || abbr == 'collins':
            return 'collins'
        case abbr == 'bm' || abbr == 'bookmarks':
            return 'bookmarks'
        default:
            return abbr
    }
}

function searchByFilter(value) {
    var items = _alfred_extension.currentDataDisplay.items;
    var item, filterItems = []
    for (var i = 0; i < items.length; i++) {
        item = items[i];
        if (item.title.search(value) != -1) {
            filterItems.push(item)
        }
    }
    return {
        icon: _alfred_extension.currentDataDisplay.icon,
        items: filterItems
    }
}
var handle_enter = new Handle(function (key, input) {
    if (key.toLowerCase() == 'enter') {
        if (!_alfred_extension.searchLock) {
            var value = transform(input.value);
            if (_alfred_extension.currentActionType) {
                actionDeliver.do(_alfred_extension.currentActionType, value)
            } else {
                _alfred_extension.currentActionType = getActionType(value);
                input.value = '';
                if (value == 'bookmarks') {
                    actionDeliver.do(_alfred_extension.currentActionType);
                    _alfred_extension.searchLock = true;
                }
            }
        } else {
            var filterItems = searchByFilter(input.value);
            actionDeliver.do('filter', filterItems)
        }
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

var handle_backspace = new Handle(function (key, input) {
    if (key.toLowerCase() == 'backspace') {
        if (input.value === undefined || input.value === '') {
            resetAlfredData();
            _alfred_extension.alfred_action_img.style.display = 'none';
            _alfred_extension.alfred_content.innerHTML = '';
        }
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

var handle_arrow = new Handle(function (key, input, e) {
    if (key.toLowerCase() == 'arrowdown' || key.toLowerCase() == 'arrowup' || key == '[' || key == ']') {
        e.stopPropagation();
        e.preventDefault();
        // if(key.toLowerCase)
        _alfred_moveActive(key);
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

var handle_escape = new Handle(function (key, input, e) {
    var alt = e.altKey;
    if (key == '.' && alt) {
        closeAlfred()
    }
})

handle_go = new Handle(function (key, input, e) {
    var alt = e.altKey;
    if (key == '/' && alt && _alfred_extension.currentActiveItem) {
        var href = _alfred_extension.currentActiveItem.getAttribute('data-href');
        if (href) {
            actionDeliver.do('open', href)
        }
    } else {
        this.next.do.apply(this.next, arguments)
    }
})
var handle_default = new Handle(function () {});


handle_enter.setNext(handle_backspace).setNext(handle_arrow).setNext(handle_go).setNext(handle_escape);