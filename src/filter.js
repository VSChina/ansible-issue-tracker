async function filter(id, item, observer, monitor, config) {
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

    var maintainers = config.maintainers || [];
    var maintainersEmail = config.mails || [];
    var assignees = await getAssignees(monitor, id, item, maintainers);

    var storedLables = item.storedLabels;
    var labels = item.labels;
    labels.push(item.type);

    try {
        var details = await observer.getTimeline(id);
        var filtered = details.filter(function (x) {
            var actor = "unknown";
            var isMaintainer = false;
            if (x.actor) {
                actor = x.actor.login;
            } else if (x.user) {
                actor = x.user.login;
            }

            isMaintainer = (maintainers.indexOf(actor) >= 0);

            if (x.committer) {
                isMaintainer = isMaintainer || (maintainersEmail.indexOf(x.committer.email) >= 0);
            }

            var isAction = ['mentioned', 'subscribed'].indexOf(x.event) < 0;

            return isAction && isMaintainer;
        });

        var date = details[0].updated_at || details[0].created_at;
        if (filtered.length === 0) {
            labels.push('never_replied');
        } else {
            var lastItem = filtered[filtered.length - 1];
            date = lastItem.updated_at || lastItem.created_at;
        }
        var datetime = Date.parse(date);
        var notUpdatedFor = Math.floor((Date.now() - datetime) / (1000 * 60 * 60 * 24));
        // 2 5 10 30
        if (notUpdatedFor >= 2 && notUpdatedFor < 5) {
            labels.push('>2days');
        } else if (notUpdatedFor >= 5 && notUpdatedFor < 10) {
            labels.push('>5days');
        } else if (notUpdatedFor >= 10 && notUpdatedFor < 30) {
            labels.push('>10days');
        } else if (notUpdatedFor >= 30) {
            labels.push('>30days');
        }

        var existingLabels = await monitor.getIssueLabels(item.projectId) || [];
        // finalLabels = exiting - stored + lables
        var finalLabels = existingLabels.filter(function (x) {
            return storedLables.indexOf(x) < 0;
        }).concat(labels);

        return {
            issueId: id,
            projectId: item.projectId,
            title: item.title,
            rawUrl: item.url,
            labels: finalLabels,
            storedLabels: labels,
            assignees: assignees,
            comment: ''
        };
    } catch (error) {
        console.error(error);
    }
}

async function getAssignees(monitor, id, item, maintainers) {
    // set assign
    var assignees = await monitor.getAssignees(id) || [];
    if (assignees.length != 0) {
        return assignees;
    }
    if (maintainers.indexOf(item.author) >= 0) {
        return [item.author];
    }
    return [];
}


export { filter };
