'use strict'

require('babel-polyfill')

import Observer from './observer.js'

var config = require('../config.json');

(async function () {
    // 1. init tags
    // 2. sync issues from origin repo
    var observer = new Observer(config.observer);
    await observer.process();
    // 3. triage issues and prs
})()