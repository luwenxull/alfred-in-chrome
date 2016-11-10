var strategies = {
    google: function (value, res) {
        chrome.tabs.create({
            url: "https://google.com/#q=" + value
        })
    },
    baidu: function (value) {
        chrome.tabs.create({
            url: "https://baidu.com/s?wd=" + value
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
                    icon: "http://cloud.ggoer.com/alfred/collins.png",
                    items: items
                });
            }

        });
    },
    bookmarks: function (value, res) {
        var bookmarksList = [];
        chrome.bookmarks.getTree(function (tree) {
            tree.forEach(function (one) {
                bookmarksList = bookmarksList.concat(getBookmarksOfFolder(one));
            })
            res({
                items: bookmarksList,
                icon: "http://cloud.ggoer.com/alfred/bookmark.png"
            });
        });
    },
    go: function (value) {
        chrome.tabs.create({
            url: value
        })
    },
    bus: function (value, res) {
        var xhr = makeRequest({
            url: "http://ggoer.com/proxy",
            type: 'post',
            data: {
                url: 'http://ggoer.com/bus/' + value
            }
        }, function (body) {
            if (body) {
                var json = JSON.parse(body);
                var items = [];
                json.data.data.forEach((bus, index) => {
                    if (bus.InTime) {
                        items.push({
                            title: index + ' ' + bus.StationCName,
                            subtitle: bus.InTime
                        })
                    }

                })
                res({
                    icon: "http://cloud.ggoer.com/alfred/bus.png",
                    items: items
                });
            }

        });
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
}

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    var type = request.type,
        content = request.content;
    strategies[type].call(null, content, response);
    return true
});


function getBookmarksOfFolder(folder) {
    var bookmarksList = [];
    for (var i = 0; i < folder.children.length; i++) {
        var child = folder.children[i];
        if (child.children) {
            bookmarksList = bookmarksList.concat(getBookmarksOfFolder(child))
        } else {
            child.subtitle = child.href = child.url;
            bookmarksList.push(child)
        }
    }
    return bookmarksList
}