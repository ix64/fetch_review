chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        if (request.request.url.indexOf("https://rate.taobao.com/feedRateList.htm") === 0) {
            request.getContent((content) => {
                const all = jsonp2json(content);
                if (all.hasOwnProperty("comments")) {
                    log(all.comments);
                    all.comments.forEach(item => {
                        uploadReview("taobao", item.rateId, item);
                    });
                } else {
                    log("Taobao Comments Response is not be Adapted!");
                    log(all);
                }
            });
        } else if (request.request.url.indexOf("https://rate.tmall.com/list_detail_rate.htm") === 0) {
            request.getContent((content) => {
                const all = jsonp2json(content);
                if (all.hasOwnProperty("rateDetail")) {
                    all.rateDetail.rateList.forEach(item => {
                        uploadReview("tmall", item.id, item);
                    });
                } else {
                    log("Tmall Comments Response is not be Adapted!");
                    log(all);
                }
            });
        } else if (request.request.url.indexOf("https://sclub.jd.com/comment/productPageComments.action") === 0) {
            request.getContent((content) => {
                const all = jsonp2json(content);
                if (all.hasOwnProperty("comments")) {
                    log(all.comments);
                    all.comments.forEach(item => {
                        uploadReview("jd", item.id, item);
                    });
                } else {
                    log("JD Comments Response is not be Adapted!");
                    log(all);
                }
            });
        } else if (request.request.url.indexOf("https://review.suning.com/ajax/cluster_review_lists/") === 0) {
            request.getContent((content) => {
                const all = jsonp2json(content);
                if (all.hasOwnProperty("commodityReviews")) {
                    log(all.commodityReviews);
                    all.commodityReviews.forEach(item => {
                        uploadReview("suning", item.commodityReviewId, item);
                    });
                } else {
                    log("Suning Comments Response is not be Adapted!");
                    log(all);
                }
            });
        }

    }
);

function log(data) {
    console.log(data);
    chrome.devtools.inspectedWindow.eval(
        'console.log(JSON.parse(unescape("' +
        escape(JSON.stringify(data)) + '")))');
}

function jsonp2json(content) {
    let start = content.indexOf("("), stop = content.lastIndexOf(")");
    if (stop > start && start > 0) {
        return JSON.parse(content.substring(start + 1, stop))
    }
    return null;
}

function uploadReview(source, id, data) {
    chrome.storage.sync.get({
        server: 'https://sz2.ixarea.com/review/'
    }, function (items) {
        const url = items.server + source + "/" + id;
        postJson(url, data, res => log(res), () => {
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
        postJson(url, data, res => log(res), () => {
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
        .then(res => res.text())
        .catch(error => {
            error_callback(error);
            log(error);
        })
        .then(callback)
    ;
}
