/**
 * Dependencies.
 */

let React = require('react');
let debug = require('debug')('ph:tabs:default-tab');
let InfiniteScroll = require('react-infinite-scroll')(React);
let cache = require('lscache');
let request = require('superagent');
let Pane = require('../../../common/product-pane/Pane.react');
let util = require('../../../common/util/util');

/**
 * Constants.
 */

const CACHE_KEY = process.env.QUOTE_CACHE_KEY;
const API_ADDR = 'https://public-api.jjh9999.com/bm-base/goldPrice/getGoldPrice';

// 只显示过滤掉的数据
const FilterPrices = [ 'windPrice', 'lmePrice', 'hkexPrice'];

/**
 * 获取黄金价格等
 */
let Quote = React.createClass({

    /**
     * Return initial state.
     *
     * @returns {Object}
     */

    getInitialState() {
        util.debugWithFuncName("getInitialState");
        this.cache = cache.get(CACHE_KEY);
        return {
            quote: this.cache || {},
        };
    },

    /**
     * Before mounting the component, cache the current
     * date.
     */

    componentWillMount() {
        util.debugWithFuncName("componentWillMount");

        this.storageLoad('quote', (value) => {
            if (value && value.quote) {
                this.setState({ quote: value.quote });
            }
            this.fetch();
        });
    },

    /**
     * On component mount, subscribe to post changes.
     */

    componentDidMount() {
        util.debugWithFuncName("componentDidMount");

        setInterval(() => {
            this.fetch();
        }, 1000);
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
            // .query({ source: "", gmcode: "" })
            .end((err, res) => {
                if (!res.status.toString().startsWith('20')) {
                    console.error(res);
                } else {
                    console.log(res.body);
                    // filter
                    if (!res.body.data) {
                        return;
                    }
                    const tmpData = res.body.data;
                    const quote = [];
                    FilterPrices.forEach((channel) => {
                        if (tmpData && !tmpData[channel]) {
                            return
                        }
                        tmpData[channel].forEach((item) => {
                            if(item.gmCode.includes('AU') || item.name.includes("黄金") || item.name.includes("伦敦金")) {
                                if (parseInt(item.sellPrice.price || 0) > 10) {
                                    item.channel = channel;
                                    quote.push(item);
                                }
                            }
                        })
                    });
                    console.log('quote', quote);
                    cache.set(CACHE_KEY, quote);
                    this.setState({ quote: quote })
                }
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
        let posts = this.state.quote.map((item) => {
            const color = parseFloat(item.sellPrice.amount) > 0 ? "quote-item quote-red" : "quote-item quote-green";
            return <div className={color} key={item.gmCode}>
                    {/*<div className="quote-channel">{item.channel[1]}</div>*/}
                <div className="quote-name">{item.name}</div>
                    <div className="quote-price">{item.sellPrice.price}</div>
                <div className="quote-info">{item.sellPrice.amount} / {item.sellPrice.spread}</div>
            </div>
        });

        return (
            <div>
                <div className="quote-content clickable block-content" onClick={() => {
                    this._openPane("https://lite.jjh9999.com/monitor")
                }}>
                    <div className="quotes">
                        {posts}
                    </div>
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

});

/**
 * Export `Github`.
 */

module.exports = Quote;
