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
                    // console.log(res.body);
                    this.setState({ posts: res.body })
                }
            });
    },

    /**
     * Render the view.
     */

    render() {
        let url = this.state.url;
        let index = 0;
        let posts = this.state.posts.map((repo) => {
            index++;

            return <div className="repo-item clickable" key={repo.name} onClick={() => {
                this._openPane(repo.url)
            }}>
                <div className="repo-title"><span className="repo-index">{index}.</span>{repo.name}</div>
                <div className="repo-info">{repo.description}</div>
                <div className="repo-stars">
                    <div className="repo-star">
                        <svg aria-label="star" className="octicon octicon-star" viewBox="0 0 14 16" version="1.1" width="14" height="16"
                             role="img">
                            <path fill-rule="evenodd"
                                  d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path>
                        </svg>
                        {repo.stars}
                    </div>
                    <div className="repo-star">
                        <svg aria-label="fork" className="octicon octicon-repo-forked" viewBox="0 0 10 16" version="1.1" width="10" height="16"
                             role="img">
                            <path fill-rule="evenodd"
                                  d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path>
                        </svg>
                        {repo.forks}

                    </div>
                    <div className="repo-star">

                        + {repo.currentPeriodStars}
                    </div>
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
                    style={{ background: "#FFF" }}
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
        // this.setState({ url: 'https://baidu.com' });
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
