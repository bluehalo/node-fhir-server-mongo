const EnrichmentProvider = require('./enrichmentProvider');

class MutationEnrichmentProvider extends EnrichmentProvider {
    /**
     * Whether this Enrichment can enrich the specified resourceType
     * @param {string} resourceType
     * @return {boolean}
     */
    canEnrich(resourceType) {
        return (resourceType === 'Mutation');
    }

    /**
     * enrich the specified resources
     * @param {Resource[]} resources
     * @param {string} resourceType
     * @return {Promise<Resource[]>}
     */
    // eslint-disable-next-line no-unused-vars
    async enrich(resources, resourceType) {
        return resources;
    }
}

module.exports = MutationEnrichmentProvider;
