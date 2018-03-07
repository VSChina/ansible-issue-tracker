
function panic(msg) {
    console.error(msg);
    process.exit(-1);
}

function timeout(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function filterLabelNameFromResponse(labels) {
    return labels.map(function(x) {
        return x.name;
    })
}

export { panic, timeout, filterLabelNameFromResponse }