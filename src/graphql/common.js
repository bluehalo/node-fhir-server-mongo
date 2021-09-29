module.exports.unBundle = (bundle) => {
    return bundle.entry.map(e => e.resource);
};
