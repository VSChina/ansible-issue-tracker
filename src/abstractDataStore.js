import { panic } from "./util";

class AbstractDataStore {
    constructor(config) {
        if (this.load === undefined || this.save === undefined) {
            panic('Must implement load() and save()');
        }

        this.config = Object.assign({
            branch: 'state-record',
            filePath: 'issue-state.json'
        }, config);
        if (!this.config.repo) {
            panic('dataStore repo cannot be empty');
        }
    }
}

export default AbstractDataStore;