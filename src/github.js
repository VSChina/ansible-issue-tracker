var parse = require('parse-github-repo-url');

class Github {
    constructor(token) {
        this.octokit = require('@octokit/rest')();
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
        };
    }

    async search(query, page, perPage) {
        const result = await this.octokit.search.issues({q: query, sort: 'updated', order: 'desc', page: page, 'per_page': perPage});
        return Object.assign({
            'total_count': 1,
            items: []
        }, result.data);
    }

    async getContent(repo, branch, file) {
        var repoInstance = Github.parseRepoUrl(repo);
        var response = await this.octokit.repos.getContent({owner: repoInstance.user, repo: repoInstance.name, path: file, ref: branch});
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
                branch: branch});
            return response.data;
        } catch (error) {
            throw error;
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
                assignees: assign || [],
                labels: labels
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateIssue(repo, number, title, body, assign, labels) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.edit({
                owner: repoInstance.user,
                repo: repoInstance.name,
                number: number,
                title: title,
                body: body,
                // assignees: assign || [], ignore the update for assignees
                labels: labels
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async closeIssue(repo, number) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.edit({
                owner: repoInstance.user,
                repo: repoInstance.name,
                number: number,
                state: 'closed'
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

    async getEventsTimeline(repo, number) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.getEventsTimeline({
                owner: repoInstance.user,
                repo: repoInstance.name,
                'issue_number': number,
                'per_page': 100
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getIssueLabels(repo, number) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.getIssueLabels({
                owner: repoInstance.user,
                repo: repoInstance.name,
                number: number
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAssignees(repo, number) {
        var repoInstance = Github.parseRepoUrl(repo);
        try {
            var response = await this.octokit.issues.addAssigneesToIssue({
                owner: repoInstance.user,
                repo: repoInstance.name,
                number: number,
                assignees: []
            });
            return response.data.assignees;
        } catch (error) {
            throw error;
        } 
    }
}

export default Github;
