/**
 * Dependencies.
 */

let React = require('react');
let debug = require('debug')('ph:tab:main');
let DefaultTab = require('./components/DefaultTab.react');
let Github = require('./components/Github.react');
let Note = require('./components/Note.react');
let renderComponent = require('../../common/render');
let loadGoogleAnalytics = require('../../common/google-analytics');
let settings = require('../../common/settings');

/**
 * Constants.
 */

const GA_ID = process.env.GA_ID;

loadGoogleAnalytics(GA_ID);
renderComponent(<DefaultTab/>, document.getElementById('main'));
renderComponent(<Github/>, document.getElementById('githubBox'));
renderComponent(<Note/>, document.getElementById('noteBox'));
