let buildStu3SearchQuery = (args) => {
  // Common search params
  let { _content, _format, _id, _lastUpdated, _profile, _query, _security, _tag } = args;

  // Search Result params
  let {
    _INCLUDE,
    _REVINCLUDE,
    _SORT,
    _COUNT,
    _SUMMARY,
    _ELEMENTS,
    _CONTAINED,
    _CONTAINEDTYPED,
  } = args;

  // AllergyIntolerance search params
  let asserter = args['asserter'];
  let category = args['category'];
  let clinical_status = args['clinical-status'];
  let code = args['code'];
  let criticality = args['criticality'];
  let date = args['date'];
  let identifier = args['identifier'];
  let last_date = args['last-date'];
  let manifestation = args['manifestation'];
  let onset = args['onset'];
  let allergyIntolerance = args['allergyIntolerance'];
  let recorder = args['recorder'];
  let route = args['route'];
  let severity = args['severity'];
  let type = args['type'];
  let verification_status = args['verification-status'];

  let query = {};

  if (asserter) {
    let queryBuilder = referenceQueryBuilder(asserter, 'asserter.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (category) {
    query.category = category;
  }

  if (clinical_status) {
    query.clinicalStatus = clinical_status;
  }

  if (code) {
    query.$or = [
      tokenQueryBuilder(code, 'code', 'code.coding'),
      tokenQueryBuilder(code, 'code', 'reaction.substance.coding'),
    ];
  }

  if (criticality) {
    query.criticality = criticality;
  }

  if (date) {
    query['assertedDate'] = dateQueryBuilder(date);
  }

  if (identifier) {
    let queryBuilder = tokenQueryBuilder(identifier, 'value', 'identifier', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (last_date) {
    query['lastOccurrence'] = dateQueryBuilder(last_date);
  }

  if (manifestation) {
    let queryBuilder = tokenQueryBuilder(
      manifestation,
      'code',
      'reaction.manifestation.coding',
      ''
    );
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (onset) {
    query['reaction.onset'] = dateQueryBuilder(onset);
  }

  if (allergyIntolerance) {
    let queryBuilder = referenceQueryBuilder(allergyIntolerance, 'allergyIntolerance.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (recorder) {
    let queryBuilder = referenceQueryBuilder(recorder, 'recorder.reference');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (route) {
    let queryBuilder = tokenQueryBuilder(route, 'code', 'reaction.exposureRoute.coding', '');
    for (let i in queryBuilder) {
      query[i] = queryBuilder[i];
    }
  }

  if (severity) {
    query['reaction.severity'] = severity;
  }

  if (type) {
    query.type = type;
  }

  if (verification_status) {
    query['verificationStatus'] = verification_status;
  }

  return query;
};

let buildDstu2SearchQuery = (args) => {
  // TODO: Build query from Parameters

  // TODO: Query database

  // AllergyIntolerance search params
  let category = args['category'];
  let criticality = args['criticality'];
  let date = args['date'];
  let identifier = args['identifier'];
  let last_date = args['last-date'];
  let manifestation = args['manifestation'];
  let onset = args['onset'];
  let allergyIntolerance = args['allergyIntolerance'];
  let recorder = args['recorder'];
  let reporter = args['reporter'];
  let route = args['route'];
  let severity = args['severity'];
  let status = args['status'];
  let substance = args['status'];
  let type = args['type'];

  let query = {};

  return query;
};

const { COLLECTION } = require('../../constants');
const base_service = require('../base/base.service')

const resource_name = 'AllergyIntolerance'
const collection_name = COLLECTION.ALLERGYINTOLERANCE;

module.exports.search = (args) =>
  base_service.search(args, resource_name, collection_name)

module.exports.searchById = (args) =>
  base_service.searchById(args, resource_name, collection_name)

module.exports.create = (args, { req }) =>
  base_service.create(args, { req }, resource_name, collection_name)

module.exports.update = (args, { req }) =>
  base_service.update(args, { req }, resource_name, collection_name)

module.exports.remove = (args, context) =>
  base_service.remove(args, context, resource_name, collection_name)

module.exports.searchByVersionId = (args, context) =>
  base_service.search(args, context, resource_name, collection_name)

module.exports.history = (args) =>
  base_service.history(args, cotnext, resource_name, collection_name)

module.exports.historyById = (args, context) =>
  base_service.historyById(args, context, resource_name, collection_name)

module.exports.patch = (args, context) =>
  base_service.patch(args, context, resource_name, collection_name)
