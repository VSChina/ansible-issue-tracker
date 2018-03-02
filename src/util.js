
function panic(msg) {
    console.error(msg);
    process.exit(-1);
}

function timeout(ms) {
    return new Promise(res => setTimeout(res, ms));
}

export { panic, timeout }