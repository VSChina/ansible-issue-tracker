function filter(id, item, observer) {
/**
 * details should contains:
 * issueId,
 * projectId,
 * title,
 * rawUrl,
 * comment,
 * labels [],
 * assign
 */
    if (!id) {
        throw 'id should not be empty';
    }
    return {
        issueId: id,
        projectId: item.target,
        title: item.title,
        rawUrl: item.url,
        labels: [ item.type ],
        assign: '',
        comment: ''
    }
}

export {filter}