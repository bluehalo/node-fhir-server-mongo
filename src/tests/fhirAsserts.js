function assertMergeIsSuccessful(body) {
    console.log('------- response from adding observation2Resource ------------');
    console.log(JSON.stringify(body, null, 2));
    console.log('------- end response  ------------');
    expect(body['created']).toBe(true);
}

function assertCompareBundles(body, expected) {
    console.log('------- response  sorted ------------');
    console.log(JSON.stringify(body, null, 2));
    console.log('------- end response sort ------------');
    // clear out the lastUpdated column since that changes
    // expect(body['entry'].length).toBe(2);
    delete body['timestamp'];
    delete body['link'];
    if (body.meta && body.meta.tag) {
        body.meta.tag.forEach(tag => {
            if (tag['system'] === 'https://www.icanbwell.com/query') {
                delete tag['display'];
            }
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
        expected.meta.tag.forEach(tag => {
            if (tag['system'] === 'https://www.icanbwell.com/query') {
                delete tag['display'];
            }
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
    expect(body).toStrictEqual(expected);
}

module.exports = {
    assertCompareBundles: assertCompareBundles,
    assertMergeIsSuccessful: assertMergeIsSuccessful
};
