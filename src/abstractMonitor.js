class AbstractMonitor {
    constructor(config) {
        if (this.createOrUpdateItem === undefined) {
            panic('Must implement createOrUpdateItem()');
        }
        this.config = config;
    }
}

export default AbstractMonitor;