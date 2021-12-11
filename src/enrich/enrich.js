const ExplanationOfBenefitsEnrichmentProvider = require('./providers/explanationOfBenefitsEnrichmentProvider');

/**
 * Registered set of enrichment providers
 * @type {EnrichmentProvider[]}
 */
const enrichmentProviders = [
    new ExplanationOfBenefitsEnrichmentProvider()
];

/**
 * Runs any registered enrichment providers
 * @param {Resource[]} resources
 * @param {string} resourceType
 * @return {Promise<Resource[]>}
 */
module.exports.enrich = async (resources, resourceType) => {
    for (const enrichmentProvider of enrichmentProviders) {
        if (enrichmentProvider.canEnrich(resourceType)) {
            resources = await enrichmentProvider.enrich(resources, resourceType);
        }
    }
    return resources;
};
