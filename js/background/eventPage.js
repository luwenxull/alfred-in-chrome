var strategies = {
    google: function (value, res) {
        res({
            icon: "http://cloud.ggoer.com/alfred/google.png",
            items: [{
                title: '你好',
                subtitle: '你是谁'
            }, {
                title: '你好',
                subtitle: '我是陆雯旭'
            }]
        })
    },
    collins: function (value, res) {
        var xhr = makeRequest({
            url: "http://ggoer.com/proxy",
            type: 'post',
            data: {
                url: 'http://ggoer.com/word/' + value
            }
        }, function (body) {
            if (body) {
                var json = JSON.parse(body);
                var items = [];
                json.paraphrases.forEach((p) => {
                        items.push({
                            title: p.english_type + ' ' + p.chinese,
                            subtitle: p.sample_sentence[0]
                        })
                    })
                    res({
                        icon:"http://cloud.ggoer.com/alfred/collins.png",
                        items:items
                    });
            }

        });
    },
    o: function (value) {
        chrome.tabs.create({
            url: value
        })
    }
}


function makeRequest(info, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                callback(xhr.response)
            }
        }
    };
    xhr.open(info.type || 'get', info.url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(info.data));

    console.log('finish');
}

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    var type = request.type,
        content = request.content;
    strategies[type].call(null, content, response)
});