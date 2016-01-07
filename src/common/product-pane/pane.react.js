/**
 * Dependencies.
 */

let React = require('react');
let Frame = require('react-frame-component');
let debug = require('debug')('ph:product-pane');
let BodyModifier = require('../body-modifier/BodyModifier.react');
let closeButton = require('../close-button');

/**
 * Constants.
 */

const CSS_URL = chrome.extension.getURL('common/product-pane/close.css');

/**
 * Product Pane View.
 *
 * Opens up the ProductHunt product pane in an iframe on
 * the right side of the screen. Also, adds an overlay and
 * disables scrolling on the body.
 *
 * Usage:
 *
 * ```js
 * <Pane url="https://www.producthunt.com/posts/mixpanel" onClick=fn />
 * ```
 *
 * Properties:
 *
 * - `url`:          Product URL
 * - `onClick`:      Overlay click event
 * - `bodyClass`:    Body class to be added when showing the overlay
 * - `overlayClass`: Overlay class (default: __phc-Overlay)
 * - `closeClass`:   Close button class (default: __phc-close)
 * - `loaderClass`:  Loader class (default: __phc-loader)
 *
 * @class
 */

let Pane = React.createClass({

  /**
   * Subscribe to iframe onload events when we
   * rerender the view.
   *
   * We hide the loading indicator and show
   * the iframe once loaded.
   */

  componentDidUpdate() {
    if (!this.props.url) return;

    let iframe = this.getDOMNode().querySelector('#__phc-product-pane');
    let loader = this.getDOMNode().querySelector('#__phc-loader');

    iframe.onload = () => {
      debug('product pane loaded');
      loader.parentNode.removeChild(loader);
      iframe.style.setProperty('display', 'block');
      iframe.onload = null;
    };
  },

  /**
   * Render the view.
   */

  render() {
    if (!this.props.url) {
      debug('no URL - bail out');
      return false;
    }

    let overlayClass = this.props.overlayClass || '__phc-overlay';
    let paneClass = this.props.paneClass || '__phc-pane';
    let closeClass = this.props.closeClass || '__phc-close';
    let loaderClass = this.props.loaderClass || '__phc-loader';

    let url = location.protocol === 'https:'
      ? this.props.url.replace('http', 'https')
      : this.props.url;

    return (
      <div>
        <BodyModifier className={this.props.bodyClass} />
        <div className={overlayClass} onClick={this.props.onClick}></div>

        <Frame className={closeClass} scrolling="no" head={
          <link type='text/css' rel='stylesheet' href={CSS_URL} />
        }>
          <div className="content" onClick={this.props.onClick}>{closeButton} </div>
        </Frame>

        <div className={paneClass}>
          <div id="__phc-loader" className={loaderClass}></div>
          <iframe src={url} id="__phc-product-pane" />
        </div>
      </div>
    );
  }
});

/**
 * Export `Pane`.
 */

module.exports = Pane;
