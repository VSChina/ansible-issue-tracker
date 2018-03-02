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
                owner: repoInstance.user,
                repo: repoInstance.name,
                path: file,
                message: 'create a new file',
                content: new Buffer(content).toString('base64'),
                branch: branch})
            return response.data
        } catch (error) {
            throw error
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
            throw error;
        }
    }

    async createIssue(repo, title, body, assign, labels) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.create({
                owner: repoInstance.user,
                repo: repoInstance.name,
                title: title,
                body: body,
                assignee: assign, 
                labels: labels
                });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateIssue(repo, number,  title, body, assign, labels) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.edit({
                owner: repoInstance.user,
                repo: repoInstance.name,
                number: number,
                title: title,
                body: body,
                assignee: assign, 
                labels: labels
                });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async commentIssue(repo, number, comment) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.createComment({
                owner: repoInstance.user,
                repo: repoInstance.name,
                number: number,
                body: comment
                });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default Github;