function moveActive(key) {
    var stage_items = document.querySelectorAll('.stage-item'),
        l = stage_items.length;
    var currentActiveIndex = 0;
    for (var i = 0; i < l; i++) {
        var si = stage_items[i];
        if (si.classList.contains('active')) {
            si.classList.remove('active');
            currentActiveIndex = i
        }
    }

    if (key.toLowerCase() == 'arrowdown') currentActiveIndex++;
    else currentActiveIndex--;

    if (currentActiveIndex < 0) currentActiveIndex = 0;
    if (currentActiveIndex >= l) currentActiveIndex = l - 1;

    stage_items[currentActiveIndex].classList.add('active');
    stage_items[currentActiveIndex].scrollIntoView();
    stage_items[currentActiveIndex].focus();
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
            _alfred_extension.currentActionType = void 0;
            _alfred_extension.alfred_action_img.style.display = 'none';
            _alfred_extension.searchLock = false;
        }
    } else {
        this.next.do.apply(this.next, arguments)
    }
});

var handle_arrow = new Handle(function (key, input, e) {
    if (key.toLowerCase() == 'arrowdown' || key.toLowerCase() == 'arrowup') {
        e.stopPropagation();
        e.preventDefault();
        // if(key.toLowerCase)
        moveActive(key);
    } else {
        this.next.do.apply(this.next, arguments)
    }
});


function closeAlfred() {
    _alfred_extension.alfred.remove()
    _alfred_extension = {
        currentActionType: undefined,
        currentDataDisplay: undefined,
        searchLock: false
    }
}
var handle_escape = new Handle(function (key, input, e) {
    var alt = e.altKey;
    if (key == '.' && alt) {
        closeAlfred()
    }
})

var handle_default = new Handle(function () {});


handle_enter.setNext(handle_backspace).setNext(handle_arrow).setNext(handle_escape).setNext(handle_default);