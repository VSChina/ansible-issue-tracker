import Observer from './observer.js'
import GithubDataStore from './githubDataStore.js';

class IssueTracker {
    constructor(config) {
        this.config = config;
    }

    _mergeState(originData, latestData) {
        originData = originData || {};
        var result = {};
        latestData.forEach(data => {
            var id = data.number;
            var origin = originData[id] || {};
            result[id] = Object.assign(origin, {
                url: data.html_url,
                title: data.title,
                type: data.pull_request ? 'pr' : 'issue',
                labels: data.labels.map((x) => { return x.name })
            })
        });
        return result;
    }

    async process() {
        // 1. init github repos
        var dataStore = new GithubDataStore(this.config.dataStore);
        var originDataTask = dataStore.load();
        // 2. sync issues from origin repo
        var observer = new Observer(this.config.observer);
        var apiData = await observer.getLatestData();
        // 3. merge new data and origin data
        var originData = await originDataTask;
        var mergedData = this._mergeState(originData, apiData);
        // 4. triage issues and prs
        // 5. save the latest data
        await dataStore.save(mergedData);
    }
}

export default IssueTracker;