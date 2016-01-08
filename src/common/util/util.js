/**
 * Created by oBlank on 1/8/16.
 */

let debug = require('debug')('ph:function:call:flow');
let assign = require('object-assign');

let util = assign({}, {

    /**
     * output current function name
     * @param msg
     */
    debugWithFuncName(fun, msg) {
        msg = msg ? msg : "";
        debug(":::", fun, "Called :::", " ", msg);
        return;
    },

});

module.exports = util;