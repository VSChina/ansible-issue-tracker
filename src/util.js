
function panic(msg) {
    console.error(msg);
    process.exit(-1);
}

export { panic }