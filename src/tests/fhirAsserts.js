/**
 * confirms that object was created
 * @param {Object} body
 */
function assertMergeIsSuccessful(body) {
    console.log('------- response from adding observation2Resource ------------');
    console.log(JSON.stringify(body, null, 2));
    console.log('------- end response  ------------');
    expect(body['created']).toBe(true);
}

/**
 * compares two bundles
 * @param {Object} body
 * @param {Object} expected
 * @param {Boolean} ignoreMetaTags
 */
function assertCompareBundles(body, expected, ignoreMetaTags = false) {
    console.log('------- response  sorted ------------');
    console.log(JSON.stringify(body, null, 2));
    console.log('------- end response sort ------------');
    // clear out the lastUpdated column since that changes
    // expect(body['entry'].length).toBe(2);
    delete body['timestamp'];
    delete expected['timestamp'];
    delete body['link'];
    if (body.meta && body.meta.tag) {
        if (ignoreMetaTags) {
            body.meta.tag = [];
        }
        body.meta.tag.forEach(tag => {
            if (tag['system'] === 'https://www.icanbwell.com/queryTime') {
                delete tag['display'];
            }
        });
    }
    body.entry.forEach(element => {
        delete element['resource']['meta']['lastUpdated'];
    });
    delete expected['link'];

    if (expected.meta && expected.meta.tag) {
        if (ignoreMetaTags) {
            expected.meta.tag = [];
        }
        expected.meta.tag.forEach(tag => {
            if (tag['system'] === 'https://www.icanbwell.com/queryTime') {
                delete tag['display'];
            }

        });
    }
    expected.entry.forEach(element => {
        if (element['resource']['meta']) {
            delete element['resource']['meta']['lastUpdated'];
        }
        delete element['resource']['$schema'];
    });

    // now sort the two lists so the comparison is agnostic to order
    body.entry = body.entry.sort((a, b) => `${a.resourceType}/${a.id}`.localeCompare(`${b.resourceType}/${b.id}`));
    expected.entry = expected.entry.sort((a, b) => `${a.resourceType}/${a.id}`.localeCompare(`${b.resourceType}/${b.id}`));

    body.entry.forEach(element => {
        delete element['fullUrl'];
        delete element['resource']['meta']['lastUpdated'];
        if (element['resource']['contained']) {
            element['resource']['contained'].forEach(containedElement => {
                delete containedElement['meta']['lastUpdated'];
            });
            // sort the list
            element['resource']['contained'] = element['resource']['contained'].sort(
                (a, b) => `${a.resourceType}/${a.id}`.localeCompare(`${b.resourceType}/${b.id}`)
            );
        }
    });
    expected.entry.forEach(element => {
        delete element['fullUrl'];
        if ('meta' in element['resource']) {
            delete element['resource']['meta']['lastUpdated'];
        }
        element['resource']['meta']['versionId'] = '1';
        if ('$schema' in element) {
            delete element['$schema'];
        }
        if (element['resource']['contained']) {
            element['resource']['contained'].forEach(containedElement => {
                delete containedElement['meta']['lastUpdated'];
            });
            // sort the list
            element['resource']['contained'] = element['resource']['contained'].sort(
                (a, b) => `${a.resourceType}/${a.id}`.localeCompare(`${b.resourceType}/${b.id}`)
            );
        }
    });

    expect(body).toStrictEqual(expected);
}

module.exports = {
    assertCompareBundles: assertCompareBundles,
    assertMergeIsSuccessful: assertMergeIsSuccessful
};
