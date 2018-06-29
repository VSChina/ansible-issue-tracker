async function filter(id, item, observer, monitor) {
    /**
     * details should contains:
     * issueId,
     * projectId,
     * title,
     * rawUrl,
     * comment,
     * labels [],       // labels you get this time
     * storedLabels [], // labels you get last time
     * assign
     */
    if (!id) {
        throw 'id should not be empty';
    }

    var storedLables = item.storedLabels;

    var labels = item.labels;
    labels.push(item.type);

    try {
        var details = await observer.getTimeline(id) || [];
        var filtered = details.filter(function (x) {
            return (['commented', 'cross-referenced', 'merged', 'referenced', 'renamed'].indexOf(x.event) > -1
                && ['kyliel', 'yuwzho', 'zikalino'].indexOf(x.actor.login) > -1);
        });

        if (filtered.length === 0) {
            labels.push('never_replied');
        } else {
            var lastItem = filtered[filtered.length - 1];
            var date = lastItem.updated_at || lastItem.created_at;
            var datetime = Date.parse(date);
            var notUpdatedFor = Math.floor((Date.now() - datetime) / (1000 * 60 * 60 * 24));
            // 2 5 10 30
            if (notUpdatedFor >= 2 && notUpdatedFor < 5) {
                labels.push('>2days');
            } else if (notUpdatedFor >= 5 && notUpdatedFor < 10) {
                labels.push('>5days');
            } else if (notUpdatedFor >= 10 && notUpdatedFor < 30) {
                labels.push('>10days');
            } else if (notUpdatedFor >= 30){
                labels.push('>30days');
            }
        }

        var existingLabels = await monitor.getIssueLabels(item.projectId) || [];
        // finalLabels = exiting - stored + lables
        var finalLabels = existingLabels.filter(function(x){
            return storedLables.indexOf(x) < 0;
        }).concat(labels);

        return {
            issueId: id,
            projectId: item.projectId,
            title: item.title,
            rawUrl: item.url,
            labels: finalLabels,
            storedLabels: labels,
            assign: '',
            comment: ''
        };
    } catch (error) {
        console.error(error);
    }
}

export { filter };
