/**
 * Dependencies.
 */

let React = require('react');
const ReactDOM = require('react-dom');
const ReactMarkdown = require('react-markdown');
var $ = require("jquery");
let debug = require('debug')('ph:tab:main');
let DefaultTab = require('./components/DefaultTab.react');
let renderComponent = require('../../common/render');
let loadGoogleAnalytics = require('../../common/google-analytics');
let settings = require('../../common/settings');


/**
 * Constants.
 */

const GA_ID = process.env.GA_ID;

loadGoogleAnalytics(GA_ID);
renderComponent(<DefaultTab />, document.getElementById('main'));

/**
 * render notes
 * @type {string}
 */
const input = '- Fabric网络搭建测试 \n - 测试环境接口-IP优化 \n - 监控增强，shell自动重启？';

ReactDOM.render(
    <ReactMarkdown source={input} />,
    document.getElementById('notes')
);


/**
 * double click note to edit
 * @type {*|jQuery|HTMLElement}
 */
$( "#notes" ).dblclick(function() {
    $( "#notes" ).fadeOut();
    $( "#editor" ).fadeIn();
    // $('#noteEditor').focus();
});

$("#noteEditor").blur(function () {
    $( "#notes" ).fadeIn();
    $( "#editor" ).fadeOut();
});