var actionDeliver = {
    do: function (value) {
        var inputArr = value.split(':');
        var strategy = inputArr.shift(),
            content = inputArr.pop();
            strategies[strategy].call(null,content)
    }
}

function drawInput() {
    var input = document.createElement('input');
    input.setAttribute('id', 'alfred-input');

    attachEventListenerOfInput(input);

    document.body.appendChild(input);
    input.focus();
}

function attachEventListenerOfInput(dom) {
    dom.addEventListener('keydown', function (e) {
        var key = e.key;
        if (key.toLowerCase() == 'enter') {
            actionDeliver.do(this.value)
        }
    })
}