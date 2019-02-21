/**
 * Remove ProductHunt's X-frame header.
 *
 * Temporary workaround, because the API responses do not include a link to the widgets
 * page. Likely we will just modify the API URL on the fly, instead of removing the
 * x-frame option, but that will do too.
 */

chrome.webRequest.onHeadersReceived.addListener(function (details) {
    let tmp = {}
    for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[ i ].name.toLowerCase() == 'content-security-policy') {
            details.responseHeaders[ i ].value = '';
        }
        if (details.responseHeaders[ i ].name.toLowerCase() == 'strict-transport-security') {
            details.responseHeaders[ i ].value = '';
        }
        // X-XSS-Protection
        if (details.responseHeaders[ i ].name.toLowerCase() == 'x-xss-protection') {
            details.responseHeaders[ i ].value = '';
        }
        if (details.responseHeaders[ i ].name.toLowerCase() == 'x-frame-options') {
            details.responseHeaders.splice(i, 1);
            // tmp = details.responseHeaders;
            // break;
        }
    }
    return { responseHeaders: details.responseHeaders };
}, { urls: [ "*://*/*" ], types: [ "main_frame", "sub_frame" ] }, [ 'blocking', 'responseHeaders' ]);

