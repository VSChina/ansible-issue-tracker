import Github from './github.js';

class Observer {
    constructor(config) {
        this.config = Object.assign({
            repo: '',
            labels: []
        }, config);
    }

    async getLatestData() {
        var repo = Github.parseRepoUrl(this.config.repo)
        var labelQuery = '';
        for (var i = 0; i < this.config.labels.length; i++) {
            labelQuery += 'label:' + this.config.labels[i] + '+';
        }

        if (labelQuery === '') {
            console.warn("You don't specific any labels, this will sync all the issues.");
        }

        var github = new Github();

        var query = labelQuery + 'is:open+user:' + repo.user + '+repo:' + repo.name;
        var result = [];
        var total = 2, per_page = 100;
        for (var page = 1; page < total; page++) { /* github search is 1 index */
            var searchResult = await github.search(query, page, per_page);
            total = searchResult.total_count / per_page + 1;
            result = result.concat(searchResult.items);
        }
        return result;
    }
}

export default Observer;
