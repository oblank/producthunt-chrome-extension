/**
 * Dependencies.
 */

let React = require('react');
var $ = require("jquery");
const ReactMarkdown = require('react-markdown');
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
            return {
                input: '双击开始编辑，支持MarkDown',
            };
        },

        /**
         * Before mounting the component, cache the current
         * date.
         */

        componentWillMount() {
            util.debugWithFuncName("componentWillMount");

            this.storageLoad('note', (value) => {
                if (value && value.note) {
                    this.setState({ input: value.note });
                    $('#noteEditor').val(value.note)
                }
            })
        },

        /**
         * On component mount, subscribe to post changes.
         */

        componentDidMount() {
            util.debugWithFuncName("componentDidMount");

            // PostStore.addChangeListener(this._handleChange);

            $("#noteContainer").dblclick(() => {
                $("#notes").hide();
                $("#editor").show();
                $('#noteEditor').focus();
            });

            $("#noteEditor").blur(() => {
                $("#notes").fadeIn();
                $("#editor").hide();
                this.storageSave($('#noteEditor').val());
                this.setState({input: $('#noteEditor').val()})
            });
        },


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

        storageLoad(key, cb) {
            chrome.storage.sync.get(key, cb);
        },

        storageSave(value) {
            chrome.storage.sync.set({ 'note': value });
        },

        render() {
            let input = this.state.input;

            return (
                <div id="noteContainer">
                    <div id="notes" class="block-content">
                        <ReactMarkdown source={input}/>
                    </div>
                    <div id="editor" class="block-content">
                        <textarea id="noteEditor"></textarea>
                    </div>
                </div>
            );
        }
    })
;

/**
 * Export `DefaultTab`.
 */

module.exports = Note;
