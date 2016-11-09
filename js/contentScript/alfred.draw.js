var actionDeliver = {
    do: function (value) {
        strategies[_alfred_extension.currentActionType].call(null, value)
    }
}

var _alfred_extension = {
    currentActionType: undefined
}

function createAlfred() {
    var alfred = document.createElement('div'),
        alfred_content = document.createElement('div'),
        alfred_input = document.createElement('input'),
        alfred_input_container = document.createElement('div'),
        alfred_action_img = document.createElement('img');

    _alfred_extension.alfred = alfred;
    _alfred_extension.alfred_content = alfred_content;
    _alfred_extension.alfred_input = alfred_input;
    _alfred_extension.alfred_action_img = alfred_action_img;

    alfred.setAttribute('id', 'alfred-container');
    alfred_content.setAttribute('id', 'alfred-stage');
    alfred_input.setAttribute('id', 'alfred-input');

    alfred_input_container.appendChild(alfred_input);
    alfred_input_container.appendChild(alfred_action_img);
    alfred_input_container.setAttribute('id', 'alfred-input-container')

    alfred_action_img.style.display = "none";
    alfred_action_img.setAttribute('id', "alfred-action-img")

    alfred.appendChild(alfred_input_container);
    alfred.appendChild(alfred_content);

    document.body.appendChild(alfred);

    attachEventListenerOfInput(alfred_input);
    alfred_input.focus();
}

var Handle = function (fn) {
    this.do = fn;
}

Handle.prototype.setNext = function (handle) {
    return this.next = handle
}

var handle_enter = new Handle(function (key, input) {
    if (key.toLowerCase() == 'enter') {
        if (_alfred_extension.currentActionType) {
            actionDeliver.do(input.value)
        } else {
            _alfred_extension.currentActionType = getActionType(input.value);
            input.value = '';
        }
    } else {
        this.next.do.apply(this.next, arguments)
    }
})

var handle_backspace = new Handle(function (key, input) {
    if (key.toLowerCase() == 'backspace') {
        if (input.value === undefined || input.value === '') {
            _alfred_extension.currentActionType = void 0;
            _alfred_extension.alfred_action_img.style.display = 'none'
        }
    } else {
        this.next.do.apply(this.next, arguments)
    }
})

var handle_arrow = new Handle(function (key, input, e) {
    if (key.toLowerCase() == 'arrowdown' || key.toLowerCase() == 'arrowup') {
        e.stopPropagation();
        e.preventDefault();
        // if(key.toLowerCase)
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

        if(currentActiveIndex<0) currentActiveIndex=0;
        if(currentActiveIndex>=l) currentActiveIndex=l-1;

        stage_items[currentActiveIndex].classList.add('active');
        stage_items[currentActiveIndex].scrollIntoView();
    } else {
        this.next.do.apply(this.next, arguments)
    }
})

var handle_default = new Handle(function () {})

handle_enter.setNext(handle_backspace).setNext(handle_arrow).setNext(handle_default)

function attachEventListenerOfInput(input) {
    input.addEventListener('keydown', function (e) {
        handle_enter.do(e.key, this, e)
    })
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