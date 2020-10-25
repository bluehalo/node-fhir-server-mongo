/*eslint no-unused-vars: "warn"*/

const { COLLECTION } = require('../../constants');
const base_service = require('../base/base.service')


module.exports.search = (args) =>
  base_service.search(args, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)

module.exports.searchById = (args) =>
  base_service.searchById(args, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)

module.exports.create = (args, { req }) =>
  base_service.create(args, {req}, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)

module.exports.update = (args, { req }) =>
  base_service.update(args, {req}, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)

module.exports.remove = (args, context) =>
  base_service.remove(args, context, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)

module.exports.searchByVersionId = (args, context) =>
  base_service.search(args, context, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)

module.exports.history = (args) =>
  base_service.history(args, cotnext, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)

module.exports.historyById = (args, context) =>
  base_service.historyById(args, context, 'ExplanationOfBenefit', COLLECTION.EXPLANATIONOFBENEFIT)
