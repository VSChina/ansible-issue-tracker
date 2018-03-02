import AbstractMonitor from './abstractMonitor.js'
import { panic } from './util'
import Github from './github.js'

class GithubMonitor extends AbstractMonitor {
    constructor(config) {
        super(config);
        if (!this.config.repo) {
            panic('monitor\'s repo must not be empty');
        }

        if (!this.config.credential_name) {
            panic('monitor\'s credential_name must not be empty');
        }

        var credential = process.env[this.config.credential_name];
        if (!credential) {
            panic('cannot load environment variable ${' + this.config.credential_name + '}');
        }
        this.github = new Github(credential);
    }

    async createOrUpdateItem(item) {
        /**
         * details should contains:
         * issueId,
         * projectId,
         * title,
         * rawUrl,
         * comment,
         * labels [],
         * assign
         */
        try {
            var body = '[' + item.rawUrl + '](' + item.rawUrl + ')';
            if (!item.projectId) {
                /* create */
                var issue = await this.github.createIssue(this.config.repo, item.title, body, null, item.labels)
                item['projectId'] = issue.number;
                console.log('create ' + issue.html_url);
            } else {
                this.github.updateIssue(this.config.repo, item.projectId, item.title, body, null, item.labels)
            }
    
            if (item.comment) {
                this.github.commentIssue(this.config.repo, item.projectId, item.comment);
            }

            return item.projectId;
        } catch (error) {
            console.error(error);
        }
    }
}

export default GithubMonitor;