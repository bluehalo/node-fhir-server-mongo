const {logRequest, logDebug, logError} = require('../common/logging');
const {
    verifyHasValidScopes,
    getAccessCodesFromScopes,
    doesResourceHaveAnyAccessCodeFromThisList
} = require('../security/scopes');
const {getResource} = require('../common/getResource');
const env = require('var');
const async = require('async');
const moment = require('moment-timezone');
const {isTrue} = require('../../utils/isTrue');
const globals = require('../../globals');
const {CLIENT_DB} = require('../../constants');
const {validateResource} = require('../../utils/validator.util');
const {BadRequestError} = require('../../utils/httpErrors');
const {buildR4SearchQuery} = require('../query/r4');

/**
 * Gets related resources
 * @param {import('mongodb').Db} db
 * @param {string} collectionName
 * @param {string} base_version
 * @param {string} host
 * @param {string | [string]} relatedResourceProperty property to link
 * @param {string | null} filterProperty (Optional) filter the sublist by this property
 * @param {*} filterValue (Optional) match filterProperty to this value
 * @return {Promise<[{resource: Resource, fullUrl: string}]|*[]>}
 */
async function get_related_resources(db, collectionName, base_version, host, relatedResourceProperty, filterProperty, filterValue) {
    /**
     * @type {import('mongodb').Collection<Document>}
     */
    const collection = db.collection(`${collectionName}_${base_version}`);
    /**
     * @type {function(?Object): Resource}
     */
    const RelatedResource = getResource(base_version, collectionName);
    /**
     * entries
     * @type {[{resource: Resource, fullUrl: string}]}
     */
    let entries = [];
    if (relatedResourceProperty) {
        // check if property is a list or not.  If not make it a list to make the code below handle both
        if (!(Array.isArray(relatedResourceProperty))) {
            relatedResourceProperty = [relatedResourceProperty];
        }
        /**
         * @type {string}
         */
        for (const relatedResourcePropertyCurrent of relatedResourceProperty) {
            if (filterProperty) {
                if (relatedResourcePropertyCurrent[`${filterProperty}`] !== filterValue) {
                    continue;
                }
            }
            if (relatedResourcePropertyCurrent.reference) {
                /**
                 * @type {string}
                 */
                const related_resource_id = relatedResourcePropertyCurrent.reference.replace(collectionName + '/', '');

                /**
                 * @type {Document | null}
                 */
                const found_related_resource = await collection.findOne({id: related_resource_id.toString()});
                if (found_related_resource) {
                    // noinspection UnnecessaryLocalVariableJS
                    entries = entries.concat([{
                        'fullUrl': `https://${host}/${base_version}/${found_related_resource.resourceType}/${found_related_resource.id}`,
                        'resource': new RelatedResource(found_related_resource)
                    }]);
                }
            }
        }
    }
    return entries;
}

// find elements in other collection that link to this object
/**
 * converts a query string into an args array
 * @type {import('mongodb').Document}
 */
function parseQueryStringIntoArgs(queryString) {
    return Object.fromEntries(new URLSearchParams(queryString));
}

/**
 * Gets related resources using reverse link
 * @param {import('mongodb').Db} db
 * @param {string} parentCollectionName
 * @param {string} relatedResourceCollectionName
 * @param {string} base_version
 * @param {Resource} parent parent entity
 * @param {string} host
 * @param {string | null} filterProperty (Optional) filter the sublist by this property
 * @param {*} filterValue (Optional) match filterProperty to this value
 * @param {string} reverse_filter Do a reverse link from child to parent using this property
 * @return {Promise<[{resource: Resource, fullUrl: string}]>}
 */
async function get_reverse_related_resources(db, parentCollectionName, relatedResourceCollectionName, base_version, parent, host, filterProperty, filterValue, reverse_filter) {
    if (!(reverse_filter)) {
        throw new Error('reverse_filter must be set');
    }
    /**
     * @type {import('mongodb').Collection<Document>}
     */
    const collection = db.collection(`${relatedResourceCollectionName}_${base_version}`);
    /**
     * @type {function(?Object): Resource}
     */
    const RelatedResource = getResource(base_version, relatedResourceCollectionName);
    /**
     * @type {[import('mongodb').Document]}
     */
    let relatedResourcePropertyDocuments;

    const query = buildR4SearchQuery(relatedResourceCollectionName, parseQueryStringIntoArgs(reverse_filter)).query;
    /**
     * @type {import('mongodb').Cursor}
     */
    const cursor = collection.find(query);
    // noinspection JSUnresolvedFunction
    relatedResourcePropertyDocuments = await cursor.toArray();
    /**
     * entries
     * @type {[{resource: Resource, fullUrl: string}]}
     */
    let entries = [];
    if (relatedResourcePropertyDocuments) {
        /**
         * relatedResourcePropertyCurrent
         * @type Resource
         */
        for (const relatedResourcePropertyCurrent of relatedResourcePropertyDocuments) {
            if (filterProperty !== null) {
                if (relatedResourcePropertyCurrent[`${filterProperty}`] !== filterValue) {
                    continue;
                }
            }
            entries = entries.concat([{
                'fullUrl': `https://${host}/${base_version}/${relatedResourcePropertyCurrent.resourceType}/${relatedResourcePropertyCurrent.id}`,
                'resource': new RelatedResource(relatedResourcePropertyCurrent)
            }]);

        }
    }
    return entries;
}

/**
 * processes a list of graph links
 * @param {import('mongodb').Db} db
 * @param {string} base_version
 * @param {string} user
 * @param {string} scope
 * @param {string} host
 * @param {Resource | [Resource]} parent_entity
 * @param {[{path:string, params: string,target:[{type: string}]}]} linkItems
 * @return {Promise<[{resource: Resource, fullUrl: string}]>}
 */
async function processGraphLinks(db, base_version, user, scope, host, parent_entity, linkItems) {
    /**
     * entries
     * @type {[{resource: Resource, fullUrl: string}]}
     */
    let entries = [];
    /**
     * @type {[Resource]}
     */
    const parentEntities = Array.isArray(parent_entity) ? parent_entity : [parent_entity];
    for (const link of linkItems) {
        for (const parentEntity of parentEntities) {
            /**
             * entries
             * @type {[{resource: Resource, fullUrl: string}]}
             */
            let entries_for_current_link = [];
            let link_targets = link.target;
            for (const target of link_targets) {
                /**
                 * @type {string}
                 */
                const resourceType = target.type;
                if (link.path) {
                    // forward link
                    /**
                     * @type {string}
                     */
                    let property = link.path.replace('[x]', '');
                    /**
                     * @type {string}
                     */
                    let filterProperty;
                    /**
                     * @type {string}
                     */
                    let filterValue;
                    // if path is more complex and includes filter
                    if (property.includes(':')) {
                        /**
                         * @type {string[]}
                         */
                        const property_split = property.split(':');
                        if (property_split && property_split.length > 0) {
                            /**
                             * @type {string}
                             */
                            property = property_split[0];
                            /**
                             * @type {string[]}
                             */
                            const filterPropertySplit = property_split[1].split('=');
                            if (filterPropertySplit.length > 1) {
                                /**
                                 * @type {string}
                                 */
                                filterProperty = filterPropertySplit[0];
                                /**
                                 * @type {string}
                                 */
                                filterValue = filterPropertySplit[1];
                            }
                        }
                    }
                    // if the property name includes . then it is a nested link
                    // e.g, 'path': 'extension.extension:url=plan'
                    if (property.includes('.')) {
                        /**
                         * @type {string[]}
                         */
                        const nestedProperties = property.split('.');
                        /**
                         * @type { Resource | [Resource]}
                         */
                        let parentEntityResources = parentEntity;
                        if (parentEntityResources) {
                            parentEntityResources = (
                                Array.isArray(parentEntityResources)
                                    ? parentEntityResources
                                    : [parentEntityResources]
                            );
                        }
                        /**
                         * @type {string}
                         */
                        for (const nestedPropertyName of nestedProperties) {
                            /**
                             * @type {[Resource]}
                             */
                            let resultParentEntityPropertyResources = [];
                            if (parentEntityResources) {
                                /**
                                 * @type {Resource}
                                 */
                                for (const parentEntityResource of parentEntityResources) {
                                    // since this is a nested entity the value of parentEntityResource[`${nestedPropertyName}`]
                                    //  will be a Resource
                                    if (parentEntityResource[`${nestedPropertyName}`]) {
                                        if (Array.isArray(parentEntityResource[`${nestedPropertyName}`])) {
                                            resultParentEntityPropertyResources = resultParentEntityPropertyResources.concat(
                                                parentEntityResource[`${nestedPropertyName}`]
                                            );
                                        } else {
                                            resultParentEntityPropertyResources.push(parentEntityResource[`${nestedPropertyName}`]);
                                        }
                                    }
                                }
                                parentEntityResources = resultParentEntityPropertyResources;
                            } else {
                                break;
                            }
                        }
                        if (parentEntityResources) {
                            if (filterProperty) {
                                parentEntityResources = (Array.isArray(parentEntityResources)
                                    ? parentEntityResources
                                    : [parentEntityResources])
                                    .filter(e => e[`${filterProperty}`] === filterValue);
                            }
                            if (link.target && link.target.length > 0 && link.target[0].link) {
                                /**
                                 * @type {Resource}
                                 */
                                for (const parentResource of parentEntityResources) {
                                    // if no target specified then we don't write the resource but try to process the links
                                    entries_for_current_link = entries_for_current_link.concat([
                                        {
                                            'resource': parentResource,
                                            'fullUrl': ''
                                        }
                                    ]);
                                }
                            } else {
                                /**
                                 * @type {Resource}
                                 */
                                for (const parentEntityProperty1 of parentEntityResources) {
                                    verifyHasValidScopes(parentEntityProperty1.resourceType, 'read', user, scope);
                                    entries_for_current_link = entries_for_current_link.concat(
                                        await get_related_resources(
                                            db,
                                            resourceType,
                                            base_version,
                                            host,
                                            parentEntityProperty1,
                                            filterProperty,
                                            filterValue
                                        )
                                    );
                                }
                            }
                        }
                    } else {
                        verifyHasValidScopes(parentEntity.resourceType, 'read', user, scope);
                        entries_for_current_link = entries_for_current_link.concat(
                            await get_related_resources(
                                db,
                                resourceType,
                                base_version,
                                host,
                                parentEntity[`${property}`],
                                filterProperty,
                                filterValue
                            )
                        );
                    }
                } else if (target.params) {
                    // reverse link
                    /**
                     * @type {string}
                     */
                    verifyHasValidScopes(parentEntity.resourceType, 'read', user, scope);
                    entries_for_current_link = entries_for_current_link.concat(
                        await get_reverse_related_resources(
                            db,
                            parent_entity.resourceType,
                            resourceType,
                            base_version,
                            parentEntity,
                            host,
                            null,
                            null,
                            target.params.replace('{ref}', parent_entity['id'])
                        )
                    );
                }
            }
            entries = entries.concat(
                entries_for_current_link.filter(e => e.resource['resourceType'] && e.fullUrl)
            );
            for (const target of link_targets) {
                /**
                 * @type {[{path:string, params: string,target:[{type: string}]}]}
                 */
                const childLinks = target.link;
                if (childLinks) {
                    /**
                     * @type {resource: Resource, fullUrl: string}
                     */
                    for (const entryItem of entries_for_current_link) {
                        entries = entries.concat(
                            await processGraphLinks(db, base_version, user, scope, host, entryItem.resource, childLinks)
                        );
                    }
                }
            }
        }
    }
    return entries;
}

/**
 * prepends # character in references
 * @param {Resource} parent_entity
 * @param {[reference:string]} linkReferences
 * @return {Promise<Resource>}
 */
async function processReferences(parent_entity, linkReferences) {
    const uniqueReferences = new Set(linkReferences);
    if (parent_entity) {
        for (const link_reference of uniqueReferences) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            let re = new RegExp('\\b' + link_reference + '\\b', 'g');
            parent_entity = JSON.parse(JSON.stringify(parent_entity).replace(re, '#'.concat(link_reference)));
        }
    }
    return parent_entity;
}

/**
 * processing a single id
 * @param {import('mongodb').Db} db
 * @param {import('mongodb').Collection<Document>} collection
 * @param {string} base_version
 * @param {string} resource_name
 * @param {string[]} accessCodes
 * @param {string} user
 * @param {string} scope
 * @param {string} host
 * @param {Resource} graphDefinition
 * @param {boolean} contained
 * @param {boolean} hash_references
 * @param {string} id1
 * @return {Promise<{resource: Resource, fullUrl: string}[]>}
 */
async function processSingleId(db, collection, base_version, resource_name, accessCodes, user,
                               scope, host, graphDefinition,
                               contained, hash_references,
                               id1) {
    /**
     * @type {function(?Object): Resource}
     */
    const StartResource = getResource(base_version, resource_name);
    /**
     * @type {[{resource: Resource, fullUrl: string}]}
     */
    let entries = [];
    /**
     * @type {?import('mongodb').Document | null}
     */
    let start_entry = await collection.findOne({id: id1.toString()});

    if (start_entry) {
        // first add this object
        /**
         * @type {{resource: Resource, fullUrl: string}}
         */
        let current_entity = {
            'fullUrl': `https://${host}/${base_version}/${start_entry.resourceType}/${start_entry.id}`,
            'resource': new StartResource(start_entry)
        };
        /**
         * @type {[{path:string, params: string,target:[{type: string}]}]}
         */
        const linkItems = graphDefinition.link;
        // add related resources as container
        /**
         * @type {[{resource: Resource, fullUrl: string}]}
         */
        const related_entries = await processGraphLinks(db, base_version, user, scope, host, new StartResource(start_entry), linkItems);
        if (env.HASH_REFERENCE || hash_references) {
            /**
             * @type {[string]}
             */
            const related_references = [];
            /**
             * @type {resource: Resource, fullUrl: string}
             */
            for (const related_item of related_entries) {
                related_references.push(related_item['resource']['resourceType'].concat('/', related_item['resource']['id']));
            }
            if (related_references.length > 0) {
                current_entity.resource = await processReferences(current_entity.resource, related_references);
            }
        }
        if (contained) {
            /**
             * @type {Resource[]}
             */
            const related_resources = related_entries.map(e => e.resource).filter(
                resource => doesResourceHaveAnyAccessCodeFromThisList(
                    accessCodes, user, scope, resource
                )
            );

            if (related_resources.length > 0) {
                current_entity['resource']['contained'] = related_resources;
            }
        }
        entries = entries.concat([current_entity]);
        if (!contained) {
            entries = entries.concat(related_entries);
        }
    }
    return entries;
}


/**
 * process GraphDefinition and returns a bundle with all the related resources
 * @param {import('mongodb').Db} db
 * @param {string} collection_name
 * @param {string} base_version
 * @param {string} resource_name
 * @param {string[]} accessCodes
 * @param {string} user
 * @param {string} scope
 * @param {string} host
 * @param {string | string[]} id (accepts a single id or a list of ids)
 * @param {*} graphDefinitionJson (a GraphDefinition resource)
 * @param {boolean} contained
 * @param {boolean} hash_references
 * @return {Promise<{entry: [{resource: Resource, fullUrl: string}], id: string, resourceType: string}|{entry: *[], id: string, resourceType: string}>}
 */
async function processGraph(db, collection_name, base_version, resource_name, accessCodes, user, scope, host, id, graphDefinitionJson, contained, hash_references) {
    /**
     * @type {function(?Object): Resource}
     */
    const GraphDefinitionResource = getResource(base_version, 'GraphDefinition');
    /**
     * @type {Resource}
     */
    const graphDefinition = new GraphDefinitionResource(graphDefinitionJson);
    /**
     * @type {import('mongodb').Collection<Document>}
     */
    let collection = db.collection(`${collection_name}_${base_version}`);

    if (!(Array.isArray(id))) {
        id = [id];
    }

    /**
     * @type {[[{resource: Resource, fullUrl: string}]]}
     */
    const entriesById = await async.map(id, async x => await processSingleId(
        db, collection, base_version, resource_name, accessCodes, user, scope, host, graphDefinition, contained, hash_references, x));
    /**
     * @type {[{resource: Resource, fullUrl: string}]}
     */
    let entries = entriesById.flat(2);
    // remove duplicate resources
    /**
     * @type {[{resource: Resource, fullUrl: string}]}
     */
    const uniqueEntries = entries.reduce((acc, item) => {
        if (!acc.find(a => a.resourceType === item.resource.resourceType && a.id === item.resource.id)) {
            acc.push(item);
        }
        return acc;
    }, []).filter(
        e => doesResourceHaveAnyAccessCodeFromThisList(
            accessCodes, user, scope, e.resource
        )
    );
    // create a bundle
    return (
        {
            resourceType: 'Bundle',
            id: 'bundle-example',
            type: 'collection',
            timestamp: moment.utc().format('YYYY-MM-DDThh:mm:ss.sss') + 'Z',
            entry: uniqueEntries
        });
}

/**
 * Supports $graph
 * @param {Object} args
 * @param {string} user
 * @param {string} scope
 * @param {Object} body
 * @param {string} path
 * @param {string} host_
 * @param {string} resource_name
 * @param {string} collection_name
 * @return {Promise<{entry: {resource: Resource, fullUrl: string}[], id: string, resourceType: string}|{entry: *[], id: string, resourceType: string}>}
 */
module.exports.oldGraph = async (args, user, scope, body, path, host_, resource_name, collection_name) => {
    logRequest(user, `${resource_name} >>> graph`);
    verifyHasValidScopes(resource_name, 'read', user, scope);

    const accessCodes = getAccessCodesFromScopes('read', user, scope);

    try {
        /**
         * @type {string}
         */
        const host = host_;
        let {base_version, id} = args;

        logRequest(user, `id=${id}`);

        id = id.split(',');
        /**
         * @type {boolean}
         */
        const contained = isTrue(args['contained']);
        /**
         * @type {boolean}
         */
        const hash_references = isTrue(args['_hash_references']);
        // Grab an instance of our DB and collection
        /**
         * @type {import('mongodb').Db}
         */
        let db = globals.get(CLIENT_DB);
        // get GraphDefinition from body
        const graphDefinitionRaw = body;
        logDebug(user, '--- validate schema of GraphDefinition ----');
        const operationOutcome = validateResource(graphDefinitionRaw, 'GraphDefinition', path);
        if (operationOutcome && operationOutcome.statusCode === 400) {
            logDebug(user, 'GraphDefinition schema failed validation');
            return operationOutcome;
        }
        // noinspection UnnecessaryLocalVariableJS
        /**
         * @type {{entry: {resource: Resource, fullUrl: string}[], id: string, resourceType: string}|{entry: *[], id: string, resourceType: string}}
         */
        const result = await processGraph(
            db,
            collection_name,
            base_version,
            resource_name,
            accessCodes,
            user,
            scope,
            host,
            id,
            graphDefinitionRaw,
            contained,
            hash_references
        );
        // const operationOutcomeResult = validateResource(result, 'Bundle', req.path);
        // if (operationOutcomeResult && operationOutcomeResult.statusCode === 400) {
        //     return operationOutcomeResult;
        // }
        return result;
    } catch (err) {
        logError(user, `Error with ${resource_name}.graph: ${err} `);
        throw new BadRequestError(err);
    }
};
