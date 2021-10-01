class EnrichmentProvider {
    /**
     * Whether this Enrichment can enrich the specified resourceType
     * @param {string} resourceType
     * @return {boolean}
     */
    // eslint-disable-next-line no-unused-vars
    canEnrich(resourceType) {
        throw Error('Not Implemented');
    }

    /**
     * enrich the specified resources
     * @param {Resource[]} resources
     * @param {string} resourceType
     * @return {Promise<Resource[]>}
     */
    // eslint-disable-next-line no-unused-vars
    async enrich(resources, resourceType) {
        throw Error('Not Implemented');
    }
}

module.exports = EnrichmentProvider;
