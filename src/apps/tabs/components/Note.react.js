/**
 * Dependencies.
 */

let React = require('react');
const $ = require("jquery");
const yearProgress = require('year-progress');
const ReactMarkdown = require('react-markdown');
let util = require('../../../common/util/util');

let Note = React.createClass({

        /**
         * Return initial state.
         *
         * @returns {Object}
         */

        getInitialState() {
            util.debugWithFuncName("getInitialState");

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
            });

            const yearInProgress = yearProgress();

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
                this.setState({ input: $('#noteEditor').val() })
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
                <div>
                    {/*<div className="block-title">TODOS</div>*/}
                    <div className="block-header">
                        <h2 className="block-title">TODOS</h2>
                        <div className="block-option-box">
                           90%
                        </div>
                    </div>

                    <div id="noteContainer">
                        <div id="notes" className="block-content block-note">
                            <ReactMarkdown source={input}/>
                        </div>
                        <div id="editor" className="block-content">
                            <textarea id="noteEditor"></textarea>
                        </div>
                    </div>
                </div>
            );
        }
    })
;

/**
 * Export `Note`.
 */

module.exports = Note;
