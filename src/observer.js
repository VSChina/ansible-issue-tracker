import Github from './github.js';

class Observer {
    constructor(config) {
        this.config = Object.assign({
            repo: '',
            labels: []
        }, config);
    }

    async process() {
        var originDataTask = DataStore.load();
        var repo = Github.parseRepoUrl(this.config.repo)
        var labelQuery = '';
        for (var i = 0; i < this.config.labels.length; i++) {
            labelQuery += 'label:' + this.config.labels[i] + '+';
        }
        var query = labelQuery + 'is:open+user:' + repo.user + '+repo:' + repo.name;
        var rawResult = [];
        var total = 2, per_page = 100;
        for (var page = 1; page < total; page++) { /* github search is 1 index */
            var searchResult = await Github.search(query, page, per_page);
            total = searchResult.total_count / per_page + 1;
            rawResult = rawResult.concat(searchResult.items);
        }

        var originData = await originDataTask;
        var result = mergeAPIResult(rawResult, originData);
        await DataStore.save(result);
    }
}

export default Observer;