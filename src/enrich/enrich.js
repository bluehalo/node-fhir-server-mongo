const ExplanationOfBenefitsEnrichmentProvider = require('./providers/explanationOfBenefitsEnrichmentProvider');
const PatientEnrichmentProvider = require('./providers/patientEnrichmentProvider');
const MutationEnrichmentProvider = require('./providers/mutationProvider');
/**
 * Registered set of enrichment providers
 * @type {EnrichmentProvider[]}
 */
const enrichmentProviders = [
    new ExplanationOfBenefitsEnrichmentProvider(),
    new PatientEnrichmentProvider(),
    new MutationEnrichmentProvider()
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
