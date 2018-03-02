import Github from './github.js';

class Observer {
    constructor(config) {
        this.config = Object.assign({
            repo: '',
            labels: []
        }, config);
        this.repo = Github.parseRepoUrl(this.config.repo);
        this.github = new Github();
    }

    async getLatestData() {
        var labelQuery = '';
        for (var i = 0; i < this.config.labels.length; i++) {
            labelQuery += 'label:' + this.config.labels[i] + '+';
        }

        if (labelQuery === '') {
            console.warn("You don't specific any labels, this will sync all the issues.");
        }

        var query = labelQuery + 'is:open+user:' + this.repo.user + '+repo:' + this.repo.name;
        var result = [];
        var total = 2, per_page = 100;
        for (var page = 1; page < total; page++) { /* github search is 1 index */
            var searchResult = await this.github.search(query, page, per_page);
            total = searchResult.total_count / per_page + 1;
            result = result.concat(searchResult.items);
        }
        return result;
    }

    async getTimeline(id) {
        return await this.github.getEventsTimeline(this.config.repo, id);
    }
}

export default Observer;
