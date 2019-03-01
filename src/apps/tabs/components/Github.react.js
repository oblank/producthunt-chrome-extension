/**
 * Dependencies.
 */

let React = require('react');
let debug = require('debug')('ph:tabs:default-tab');
let InfiniteScroll = require('react-infinite-scroll')(React);
let cache = require('lscache');
let request = require('superagent');
let Pane = require('../../../common/product-pane/Pane.react');
let util = require('../../../common/util/util')

/**
 * Constants.
 */

const CACHE_KEY = process.env.GITHUB_CACHE_KEY;
const API_ADDR = 'https://github-trending-api.now.sh/repositories';

const OPTIONS_LANS = [
    { value: 'all', label: 'All' },
    { value: 'go', label: 'Go' },
    { value: 'php', label: 'PHP' },
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'vue', label: 'Vue' },
    { value: 'typescript', label: 'Typescript' },
    { value: 'swift', label: 'Swift' },
    { value: 'graphql', label: 'GraphQL' },
    { value: 'c++', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'rust', label: 'Rust' },
    { value: 'lua', label: 'Lua' },
    { value: 'perl', label: 'Perl' },
    { value: 'pod', label: 'Pod' },
    { value: 'dart', label: 'Dart' },
    { value: 'kotlin', label: 'Kotlin' }
];

// daily, weekly and monthly
const OPTIONS_SINCE = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
];

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
            lang     : OPTIONS_LANS[ 0 ].value, // all
            since    : OPTIONS_SINCE[ 0 ].value, // daily
            startPage: startPage
        };
    },

    /**
     * Before mounting the component, cache the current
     * date.
     */

    componentWillMount() {
        util.debugWithFuncName("componentWillMount");

        this.storageLoad('lang', (value) => {
            if (value && value.lang) {
                this.setState({ lang: value.lang });
            }
            this.storageLoad('since', (value) => {
                if (value && value.since) {
                    this.setState({ since: value.since }, () => this.fetch());
                } else {
                    this.fetch();
                }
            })
        });


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
        request
            .get(API_ADDR)
            .query({ language: this.state.lang, since: this.state.since })
            .end((err, res) => {
                if (res.status !== 200) {
                    console.error(res);
                } else {
                    // console.log(res.body);
                    cache.set(CACHE_KEY, res.body);
                    this.setState({ posts: res.body })
                }
            });
    },

    handleChange(event) {
        const value = event.target.value;
        this.setState({ lang: value }, () => {
            this.storageSave('lang', value);
            this.fetch();
        });
    },

    handleChangeSince(event) {
        const value = event.target.value;
        this.setState({ since: value }, () => {
            this.storageSave('since', value);
            this.fetch()
        });
    },

    storageLoad(key, cb) {
        chrome.storage.sync.get(key, cb);
    },

    storageSave(key, value) {
        chrome.storage.sync.set({ [ key ]: value });
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
                        <svg aria-label="fork" className="octicon octicon-repo-forked" viewBox="0 0 10 16" version="1.1" width="10"
                             height="16"
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
                <div className="block-header">
                    <h2 className="block-title">GitHub Trending</h2>
                    <div className="block-option-box">
                        <select className="block-select" value={this.state.lang} onChange={this.handleChange}>
                            {
                                OPTIONS_LANS.map((option) => {
                                    return <option key={option.value} value={option.value}>{option.label}</option>
                                })
                            }
                        </select>
                        <span className="block-span-line">|</span>
                        <select className="block-select" value={this.state.since} onChange={this.handleChangeSince}>
                            {
                                OPTIONS_SINCE.map((option) => {
                                    return <option key={option.value} value={option.value}>{option.label}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="block-content">
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
        // this.setState({ url: url });
        chrome.tabs.create({ url: url });
    },

    /**
     * Close the product pane.
     */

    _closePane() {
        debug("[x]close pane with url");
        this.setState({ url: false });
    },
});

/**
 * Export `Github`.
 */

module.exports = Github;
