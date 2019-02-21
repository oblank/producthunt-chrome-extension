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
renderComponent(<DefaultTab/>, document.getElementById('main'));

// 更新note
var storageLoad = function (key, cb) {
    chrome.storage.sync.get(key, cb);
};

var storageSave = function (value) {
    chrome.storage.sync.set({ 'note': value });
};
let input = '双击编辑';
storageLoad('note', function (value) {
    input = value && value.note ? value.note : '双击编辑，支持markDown';
    if (value && value.note) {
        $('#noteEditor').val(input);
    }
    ReactDOM.render(
        <ReactMarkdown source={input}/>,
        document.getElementById('notes')
    );
});


/**
 * double click note to edit
 * @type {*|jQuery|HTMLElement}
 */
$("#notes").click(function () {
    $("#notes").hide();
    $("#editor").show();
    $('#noteEditor').focus();
});

$("#noteEditor").blur(function () {
    $("#notes").fadeIn();
    $("#editor").fadeOut();
    storageSave($('#noteEditor').val());


});