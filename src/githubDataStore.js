import { panic } from './util.js'
import AbstractDataStore from "./abstractDataStore.js"
import Github from './github.js'
import { Buffer } from 'buffer';

class GithubDataStore extends AbstractDataStore {
    constructor(config) {
        super(config);
        this.config = Object.assign({
            sha: undefined
        }, this.config)

        if (!this.config.credential_name) {
            panic('dataStore credential_name cannot be empty');
        }

        var credential = process.env[this.config.credential_name];
        if (!credential) {
            panic('cannot load environment variable ${' + this.config.credential_name + '}');
        }
        this.github = new Github(credential);
    }

    async load() {
        var { repo, branch, filePath } = this.config;
        var result;
        try {
            var response = await this.github.getContent(repo, branch, filePath);
            result = new Buffer(response.content, 'base64').toString();
            this.sha = response.sha;
            console.log(response)
        } catch (err) {
            console.log(err.status)
            if (err.code != 404) {
                result = {};
            }
        }

        if (!result) {
            result = {};
            var response = await this.github.createFile(repo, branch, filePath, '{}');
            this.sha = response.sha;          
        }

        return result
    }

    async save(content) {
        var { repo, branch, filePath } = this.config;
        console.log(this.sha)
        try {
            await this.github.updateFile(repo, branch, filePath, JSON.stringify(content), this.sha);
        } catch (error) {
            panic(error);
        }
    }
}

export default GithubDataStore;