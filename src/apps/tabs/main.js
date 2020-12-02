/**
 * Dependencies.
 */

let React = require('react');
let debug = require('debug')('ph:tab:main');
let DefaultTab = require('./components/DefaultTab.react');
let Github = require('./components/Github.react');
let Note = require('./components/Note.react');
let Quote = require('./components/Quote.react');
let Crypto = require('./components/Crypto.react');
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
renderComponent(<Quote/>, document.getElementById('quoteBox'));
renderComponent(<Crypto/>, document.getElementById('cryptoBox'));
