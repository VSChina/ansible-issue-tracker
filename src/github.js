var parse = require('parse-github-repo-url')

class Github {
    constructor(token) {
        this.octokit = require('@octokit/rest')()
        if (token) {
            this.octokit.authenticate({
                type: 'token',
                token: token
            });
        }
    }
    static parseRepoUrl(url) {
        var [user, repo] = parse(url);
        return {
            name: repo,
            user: user
        }
    }

    async search(query, page, per_page) {
        const result = await this.octokit.search.issues({q: query, sort: 'updated', order: 'desc', page: page, per_page: per_page});
        return Object.assign({
            total_count: 1,
            items: []
        }, result.data)
    }

    async getContent(repo, branch, file) {
        var repoInstance = Github.parseRepoUrl(repo);
        var response = await this.octokit.repos.getContent({owner: repoInstance.user, repo: repoInstance.name, path: file, ref: branch})
        return response.data;
    }

    async createFile(repo, branch, file, content) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response= await this.octokit.repos.createFile({
                repo: repoInstance.name,
                path: file,
                message: 'create a new file',
                content: new Buffer(content).toString('base64'),
                branch: branch})
            return response.data
        } catch (error) {
            console.error(error.HttpError.message)
        }

    }

    async updateFile(repo, branch, file, content, sha) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.repos.updateFile({
                owner: repoInstance.user,
                repo: repoInstance.name,
                path: file,
                message: 'update file',
                content: new Buffer(content).toString('base64'),
                sha: sha,
                branch: branch});
            return response.data;
        } catch (error) {
            console.log(error)
            throw error.HttpError
        }
    }
}

export default Github;