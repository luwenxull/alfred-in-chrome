var alfred_mode={
	'SEARCH':'SEARCH',
	'NORMAL':'NORMAL',
	'LINK':'LINK',
	'QUICK':'QUICK'
}

function Alfred() {
	this.initDom();
	this.mode=alfred_mode.NORMAL;
	this.inputHistory=new AlfredHistory();
}

Alfred.prototype.initDom=function(){
	this.domReference={};
	var container = document.createElement('div'),
		stage = document.createElement('div'),
		input = document.createElement('input'),
		input_container = document.createElement('div'),
		action_img = document.createElement('img');

	container.setAttribute('id', 'alfred-container');
	stage.setAttribute('id', 'alfred-stage');
	input.setAttribute('id', 'alfred-input');

	input_container.appendChild(input);
	input_container.appendChild(action_img);
	input_container.setAttribute('id', 'alfred-input-container')

	action_img.style.display = "none";
	action_img.setAttribute('id', "alfred-action-img")

	container.appendChild(input_container);
	container.appendChild(stage);

	this.domReference.container = container;
	this.domReference.stage = stage;
	this.domReference.input = input;
	this.domReference.input_container = input_container;
	this.domReference.action_img=action_img;

	attachEventListenerOfInput(input);
	document.body.appendChild(this.domReference.container);
}

Alfred.prototype.close=function(){
	$(this.domReference.container).hide();
	this.clear();
}

Alfred.prototype.open=function(){
	$(this.domReference.container).show();
	this.domReference.input.focus();
}

Alfred.prototype.clear=function(){
	this.currentActionType=null;
	this.currentActiveItem=null;
	this.currentDataDisplay=null;
	this.mode=alfred_mode.NORMAL;
}

var createAlfred = (function () {
	var alfred;
	return function () {
		return alfred || (alfred = new Alfred())
	}
})()

function AlfredHistory() {
	this.history = []
}

AlfredHistory.prototype.add = function (value) {
	this.history.push(value)
}

AlfredHistory.prototype.getLast = function () {
	return this.history[this.history.length - 1]
}

AlfredHistory.prototype.getAll = function () {
	return this.history
}

/*监听alfred初始化事件 以及 退出事件*/

var _alfred_extension;
document.body.addEventListener('keydown', function (e) {
	var key = e.key,
		code = e.code
	alt = e.altKey;
	if ((key == ',' || code == 'Comma') && alt) {
		e.stopPropagation();
		e.preventDefault();
		_alfred_extension = createAlfred();
		_alfred_extension.open();
	}
	if (key.toLowerCase() == 'escape') {
		_alfred_extension.close()
	}
})


function attachEventListenerOfInput(input) {
	input.addEventListener('keydown', function (e) {
		handle_enter.do(e.key, this, e);
		e.stopPropagation();
		console.log(_alfred_extension);
	})
	input.addEventListener('change', function () {
		console.log('change');
	})
}