/*chrome.devtools.panels.create("Fetch Review",
    "images/icon48.png",
    "panel.html",
    function (panel) {
    }
);*/

chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        if (request.request.url.indexOf("https://rate.taobao.com/feedRateList.htm") !== -1) {
            request.getContent((content, encoding) => {
                const all = jsonp2json(content).comments;
                log(all);
                all.forEach(item => {
                    uploadReview("taobao", item.rateId, item);
                });
            });
        } else if (request.request.url.indexOf("https://rate.tmall.com/list_detail_rate.htm") !== -1) {
            request.getContent((content, encoding) => {
                const all = jsonp2json(content).rateDetail.rateList;
                log(all);
                all.forEach(item => {
                    uploadReview("tmall", item.id, item);
                });
            });
        } else if (request.request.url.indexOf("https://sclub.jd.com/comment/productPageComments.action") !== -1) {
            request.getContent((content, encoding) => {
                const all = jsonp2json(content).comments;
                log(all);
                all.forEach(item => {
                    uploadReview("jd", item.id, item);
                });

            });
        } else if (request.request.url.indexOf("https://review.suning.com/ajax/cluster_review_lists/") !== -1) {
            request.getContent((content, encoding) => {
                const all = jsonp2json(content).commodityReviews;
                log(all);
                all.forEach(item => {
                    uploadReview("suning", item.commodityReviewId, item);
                });

            });
        }

    }
);

function log(data) {
    chrome.devtools.inspectedWindow.eval(
        'console.log(JSON.parse(unescape("' +
        escape(JSON.stringify(data)) + '")))');
}

function jsonp2json(content) {
    let matches = content.match(/\w+\(({[^()]+})\)/);
    if (matches) {
        return JSON.parse(matches[1]);
    }
    return content;
}

function uploadReview(source, id, data) {
    chrome.storage.sync.get({
        server: 'https://sz2.ixarea.com/review/'
    }, function (items) {
        const url = items.server + source + "/" + id;
        postJson(url, data, res => log(res.json()), () => {
            log("Fail to Upload Review");
        });
    });
}

function reportError(message, url, lineNumber, columnNo, error) {
    const data = {
        message: message,
        url: url,
        lineNumber: lineNumber,
        columnNo: columnNo,
        error: error
    };
    chrome.storage.sync.get({
        server: 'https://sz2.ixarea.com/review/'
    }, function (items) {
        const url = items.server + "report/";
        postJson(url, data, res => log(res.json()), () => {
                log("Fail to Report Error");
            }
        );
    });

}

function postJson(url, data, callback, error_callback) {

    fetch(url, {
        body: JSON.stringify(data),
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(callback)
        .catch(error_callback);
}
