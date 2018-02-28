var parse = require('parse-github-repo-url')
const octokit = require('@octokit/rest')()

class Github {
    static parseRepoUrl(url) {
        // [user, repo, version] = parse(url);
        // return {
        //     name: repo,
        //     user: user
        // }
        return {
            name: "ansible",
            user:"ansible"
        }
    }

    static async search(query, page, per_page) {
        const result = await octokit.search.issues({q: query, sort: 'updated', order: 'desc', page: page, per_page: per_page});
        return Object.assign({
            total_count: 1,
            items: []
        }, result.data)
    }
}

export default Github;