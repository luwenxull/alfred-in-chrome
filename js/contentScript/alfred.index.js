var _alfred_extension = {
    currentActionType: undefined,
	currentDataDisplay:undefined,
	searchLock:false
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
    // attachEventListenerOfContent(alfred_content);
    alfred_input.focus();
}

/*监听alfred初始化事件 以及 退出事件*/
document.body.addEventListener('keydown', function (e) {
	var key = e.key,
		code = e.code
	alt = e.altKey;
	if ((key == ',' || code == 'Comma') && alt) {
		e.stopPropagation();
		e.preventDefault();
		createAlfred()
	}
})


function attachEventListenerOfInput(input) {
    input.addEventListener('keydown', function (e) {
        handle_enter.do(e.key, this, e);
        e.stopPropagation();
    })
}