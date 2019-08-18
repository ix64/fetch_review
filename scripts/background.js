chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({server: 'https://sz2.ixarea.com/review/'});

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        regRule();
    });
});

function regRule() {
    chrome.declarativeContent.onPageChanged.addRules([
        {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'item.jd.com'}}),
                new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'item.taobao.com'}}),
                new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'detail.tmall.com'}}),
                new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'product.suning.com'}}),
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }
    ]);
}


chrome.pageAction.onClicked.addListener(function (tab) {
    if (tab.url.indexOf("https://item.taobao.com") === 0) {
        exec(autoTaobao);
    } else if (tab.url.indexOf("https://item.jd.com") === 0) {
        exec(autoJd)
    } else if (tab.url.indexOf("https://detail.tmall.com") === 0) {
        exec(autoTmall)
    } else if (tab.url.indexOf("https://product.suning.com") === 0) {
        exec(autoSuning)
    }
});

function autoTaobao() {
    document.querySelector("a.tb-tab-anchor[data-index='1']").click();
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            document.querySelector("li.pg-next").click()
        }, 1000 * i)
    }
}

function autoTmall() {
    document.querySelector("a[href='#J_Reviews']").click();
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            document.querySelector("#J_Reviews").querySelectorAll("a[data-page]")[1].click()
        }, 1000 * i)
    }
}

function autoSuning() {
    document.querySelector("#productCommTitle").click();
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            document.querySelector("a.next.rv-maidian").click()
        }, 1000 * i)
    }
}

function autoJd() {
    document.querySelector("[data-anchor='#comment']").click();
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            document.querySelector("a.ui-pager-next").click()
        }, 1000 * i)
    }
}


function log(data) {
    exec("()=>{console.log(JSON.parse(unescape(\"" + escape(JSON.stringify(data)) + "\")));}")
}

function exec(func) {
    chrome.tabs.executeScript({
        code: "(" + func + ")();"
    });
}