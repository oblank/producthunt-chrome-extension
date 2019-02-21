/**
 * Dependencies.
 */

let React = require('react');
let debug = require('debug')('ph:tabs:default-tab');
let InfiniteScroll = require('react-infinite-scroll')(React);
let cache = require('lscache');
let async = require('async');
let PostGroup = require('./PostGroup.react');
let PostStore = require('../../../common/stores/PostStore');
let api = require('../../../common/api');
let Pane = require('../../../common/product-pane/Pane.react');
let util = require('../../../common/util/util')

/**
 * Constants.
 */

const CACHE_KEY = process.env.PRODUCTS_CACHE_KEY;



let Note = React.createClass({

  /**
   * Return initial state.
   *
   * @returns {Object}
   */

  getInitialState() {
    util.debugWithFuncName("getInitialState");

    this.cache = cache.get(CACHE_KEY);

    let firstPageCached = !!this.cache;

    // if we have cache, this means the first page has been already
    // fetched, therefore start from the next one
    let startPage = firstPageCached ? 0 : -1;

    debug('start page: %d', startPage);

    return {
      posts: this.cache || [],
      startPage: startPage
    };
  },

  /**
   * Before mounting the component, cache the current
   * date.
   */

  componentWillMount() {
    util.debugWithFuncName("componentWillMount");

  },

  /**
   * On component mount, subscribe to post changes.
   */

  componentDidMount() {
    util.debugWithFuncName("componentDidMount");

    // PostStore.addChangeListener(this._handleChange);
  },

  //shouldComponentUpdate() {
  //  util.debugWithFuncName("shouldComponentUpdate");
  //  return true;
  //},

  componentWillUpdate() {
    util.debugWithFuncName("componentWillUpdate");
  },

  componentDidUpdate() {
    util.debugWithFuncName("componentDidUpdate");
  },

  /**
   * On component unmount, unsubscribe from post changes.
   */

  componentWillUnmount() {
    util.debugWithFuncName("componentWillUnmount");

    // PostStore.removeChangeListener(this._handleChange);
  },

  /**
   * Render the view.
   */

  render() {
    let url = this.state.url;

    return (
      <div>
          <div id="notes" class="block-content">

          </div>
          <div id="editor" class="block-content">
              <textarea id="noteEditor"></textarea>
          </div>
      </div>
    );
  },

  /**
   * Open the product pane.
   *
   * @param {String} url
   */

  _openPane(url) {
    debug("[-]open pane with url", url);
    this.setState({ url: url });
  },

  /**
   * Close the product pane.
   */

  _closePane() {
    debug("[x]close pane with url");
    this.setState({ url: false });
  },

  /**
   * Load next page (day) with posts.
   *
   * @param {Number} page
   */

  _loadNext(daysAgo) {
    fetch.push(daysAgo);
  },

  /**
   * Handle post change event.
   */

  _handleChange() {
    this.setState({ posts: PostStore.getPosts() });
  }
});

/**
 * Export `DefaultTab`.
 */

module.exports = DefaultTab;
