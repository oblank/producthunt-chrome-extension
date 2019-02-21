/**
 * Dependencies.
 */

let React = require('react');
let debug = require('debug')('ph:tabs:default-tab');
let InfiniteScroll = require('react-infinite-scroll')(React);
let cache = require('lscache');
let async = require('async');
let request = require('superagent');
let PostGroup = require('./PostGroup.react');
let PostStore = require('../../../common/stores/PostStore');
let api = require('../../../common/api');
let Pane = require('../../../common/product-pane/Pane.react');
let util = require('../../../common/util/util')

/**
 * Constants.
 */

const CACHE_KEY = process.env.GITHUB_CACHE_KEY;

/**
 * Queue for fetching the next page with posts.
 */

let Github = React.createClass({

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
            posts    : this.cache || [],
            startPage: startPage
        };
    },

    /**
     * Before mounting the component, cache the current
     * date.
     */

    componentWillMount() {
        util.debugWithFuncName("componentWillMount");
        this._loadNext();

        if (this.cache) {
            debug('using cache, refreshing it');
            this._loadNext();
        }
    },

    /**
     * On component mount, subscribe to post changes.
     */

    componentDidMount() {
        util.debugWithFuncName("componentDidMount");

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

    },

    fetch() {
        const apiAddr = 'https://github-trending-api.now.sh/repositories';
        request
            .get(apiAddr)
            .query({ language: 'all', since: 'weekly' })
            .end((err, res) => {
                if (res.status !== 200) {
                    console.error(res);
                } else {
                    console.log(res.body);
                    this.setState({ posts: res.body })
                }
            });
    },

    /**
     * Render the view.
     */

    render() {
        let url = this.state.url;

        let posts = this.state.posts.map((repo) => {
            return <div key={repo.name} onClick={() => {
                this._openPane(repo.url)
            }}>
                <div id="repo-title">{repo.name}</div>
                <div id="repo-info">
                    {repo.description}
                </div>
                <div id="repo-info">
                    <div id="">{repo.stars}</div>
                    <div id="">{repo.fork}</div>
                    <div id="">{repo.currentPeriodStars}</div>
                </div>
            </div>
        });


        return (
            <div>
                <div className="products">
                    <InfiniteScroll
                        loader={<div className="loading">Trending...</div>}
                        // pageStart={this.state.startPage}
                        // loadMore={this._loadNext}
                        // hasMore={true}
                    >
                        {posts}
                    </InfiniteScroll>
                </div>

                <Pane
                    bodyClass="no-scroll"
                    loaderClass="loader"
                    overlayClass="overlay"
                    closeClass="close"
                    paneClass="pane"
                    url={url}
                    onClick={this._closePane}/>
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

    _loadNext() {
        this.fetch();
    }
});

/**
 * Export `DefaultTab`.
 */

module.exports = Github;
