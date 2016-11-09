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
        alfred_input_container=document.createElement('div'),
        alfred_action_img=document.createElement('img');

    _alfred_extension.alfred = alfred;
    _alfred_extension.alfred_content = alfred_content;
    _alfred_extension.alfred_input = alfred_input;
    _alfred_extension.alfred_action_img=alfred_action_img;

    alfred.setAttribute('id', 'alfred-container');
    alfred_content.setAttribute('id', 'alfred-stage');
    alfred_input.setAttribute('id', 'alfred-input');

    alfred_input_container.appendChild(alfred_input);
    alfred_input_container.appendChild(alfred_action_img);
    alfred_input_container.setAttribute('id','alfred-input-container')

    alfred_action_img.style.display="none";
    alfred_action_img.setAttribute('id',"alfred-action-img")

    alfred.appendChild(alfred_input_container);
    alfred.appendChild(alfred_content);

    document.body.appendChild(alfred);

    attachEventListenerOfInput(alfred_input);
    alfred_input.focus();
}

function attachEventListenerOfInput(input) {
    input.addEventListener('keydown', function (e) {
        var key = e.key,value = this.value;
        if (key.toLowerCase() == 'enter') {
            if (_alfred_extension.currentActionType) {
                actionDeliver.do(this.value)
            } else {
                _alfred_extension.currentActionType=getActionType(value);
                this.value='';
            }
        }
        if(key.toLowerCase()=='backspace'){
            if(value===undefined || value===''){
                _alfred_extension.currentActionType=void 0;
                _alfred_extension.alfred_action_img.style.display='none'
            }
        }
        if(key.toLowerCase()=='arrowdown'){
            e.stopPropagation();
		    e.preventDefault();
            var topPx=_alfred_extension.alfred_content.scrollTop;
            _alfred_extension.alfred_content.scrollTop=topPx+300;
        }
        if(key.toLowerCase()=='arrowup'){
            e.stopPropagation();
		    e.preventDefault();
            var topPx=_alfred_extension.alfred_content.scrollTop;
            _alfred_extension.alfred_content.scrollTop=topPx-300;
        }

    })
}

function getActionType(value) {
    for (var i = 0; i < allActionTypes.length; i++) {
        var aType = allActionTypes[i]
        if (aType===value) {
             _alfred_extension.alfred_action_img.setAttribute('src',iconConfig[aType]);
             _alfred_extension.alfred_action_img.style.display="inline";
            return aType
        }
    }
    return void 0;
}