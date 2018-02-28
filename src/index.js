'use strict'

import IssueTracker from './issueTracker.js';

(async function () {
    var config = require('../config.json');
    var issueTracker = new IssueTracker(config);
    await issueTracker.process();
})()
