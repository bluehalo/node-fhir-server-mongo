const { parse } = require('graphql');
const { search } = require('../../services/base/base.service');
const { getCurrentDate, mapEOB } = require('./graphqlish.mappers');

function filter(eobData, billablePeriod, allowedAmount, youPaid, insurancePaid, claimTypes) {
  let filteredData = eobData.entry;
  filteredData =
    filteredData === null || filteredData === void 0
      ? void 0
      : filteredData.filter((bundleEntry) => {
          var _a, _b;
          let claimTypeMatches = true;
          if (claimTypes) {
            const claimTypesMapping = {
              medical: ['institutional', 'professional'],
              prescription: ['pharmacy'],
              dental: ['oral'],
              vision: ['vision'],
              lab: [],
            };
            const claimTypesToBeMatched = [];
            claimTypes.forEach((claimType) =>
              // eslint-disable-next-line security/detect-object-injection
              claimTypesToBeMatched.push(...claimTypesMapping[claimType])
            );
            claimTypeMatches = bundleEntry.resource.type.coding.some(
              (coding) => claimTypesToBeMatched.indexOf(coding.code) !== -1
            );
          }
          if (!claimTypeMatches) {
            return false;
          }
          let billablePeriodMatches = true;
          if (billablePeriod) {
            if (
              billablePeriod.start &&
              ((_a = bundleEntry.resource.billablePeriod) === null || _a === void 0
                ? void 0
                : _a.start)
            ) {
              const startDate = new Date(bundleEntry.resource.billablePeriod.start);
              startDate.setHours(0, 0, 0, 0);
              const filterStartDate = new Date(billablePeriod.start);
              filterStartDate.setHours(0, 0, 0, 0);
              billablePeriodMatches = startDate >= filterStartDate;
            }
            if (
              billablePeriodMatches &&
              billablePeriod.end &&
              ((_b = bundleEntry.resource.billablePeriod) === null || _b === void 0
                ? void 0
                : _b.end)
            ) {
              const endDate = new Date(bundleEntry.resource.billablePeriod.end);
              endDate.setHours(0, 0, 0, 0);
              const filterEndDate = new Date(billablePeriod.end);
              filterEndDate.setHours(0, 0, 0, 0);
              billablePeriodMatches = endDate <= filterEndDate;
            }
          }
          if (!billablePeriodMatches) {
            return false;
          }
          let allowedAmountMatches = true;
          if (allowedAmount) {
            if (!isNaN(allowedAmount.min)) {
              if (allowedAmount.min <= 0) {
                allowedAmountMatches =
                  bundleEntry.resource.amounts.allowed >= allowedAmount.min ||
                  bundleEntry.resource.amounts.allowed === null;
              } else {
                allowedAmountMatches = bundleEntry.resource.amounts.allowed >= allowedAmount.min;
              }
            }
            if (allowedAmountMatches && !isNaN(allowedAmount.max)) {
              if (allowedAmount.max >= 0) {
                allowedAmountMatches =
                  bundleEntry.resource.amounts.allowed <= allowedAmount.min ||
                  bundleEntry.resource.amounts.allowed === null;
              } else {
                allowedAmountMatches = bundleEntry.resource.amounts.allowed <= allowedAmount.min;
              }
            }
          }
          if (!allowedAmountMatches) {
            return false;
          }
          let youPaidMatches = true;
          if (youPaid) {
            if (!isNaN(youPaid.min)) {
              youPaidMatches = bundleEntry.resource.amounts.memberPaid >= youPaid.min;
            }
            if (youPaidMatches && !isNaN(youPaid.max)) {
              youPaidMatches = bundleEntry.resource.amounts.memberPaid <= youPaid.max;
            }
          }
          if (!youPaidMatches) {
            return false;
          }
          let insurancePaidMatches = true;
          if (insurancePaid) {
            if (!isNaN(insurancePaid.min)) {
              insurancePaidMatches =
                bundleEntry.resource.amounts.insurancePaid >= insurancePaid.min;
            }
            if (insurancePaidMatches && !isNaN(insurancePaid.max)) {
              insurancePaidMatches =
                bundleEntry.resource.amounts.insurancePaid <= insurancePaid.max;
            }
          }
          return insurancePaidMatches;
        });
  eobData.entry = filteredData;
  eobData.total = filteredData === null || filteredData === void 0 ? void 0 : filteredData.length;
  return eobData;
}
module.exports.graphqlish = (req) => {
  if (req.query.query === undefined) {
    return { status: 'unsupported' };
  }
  const parsedQuery = parse(req.query.query);
  const firstOperationDefinition = (ast) => ast.definitions[0];
  const firstFieldValueNameFromOperation = (operationDefinition) =>
    operationDefinition.selectionSet.selections[0].name.value;
  const argumentsFromOperation = (operationDefinition) =>
    operationDefinition.selectionSet.selections[0].arguments;
  const operation = firstOperationDefinition(parsedQuery).operation;
  const queryType = firstFieldValueNameFromOperation(firstOperationDefinition(parsedQuery));
  const params = argumentsFromOperation(firstOperationDefinition(parsedQuery));
  const paramMap = new Map();
  for (const p of params) {
    paramMap.set(p.name.value, p.value.value);
  }
  const args = Object.fromEntries(paramMap);
  args.base_version = '4_0_0';
  let bundles = [];
  if (operation === 'query' && queryType === 'ExplanationOfBenefit') {
    return (async () => {
      const promise = search(args, { req }, queryType, queryType);
      const eobs = await promise;
      for (const eob of eobs) {
        bundles.push(mapEOB(eob, { req }));
      }
      return filter(
        {
          resourceType: 'Bundle',
          type: 'ExplanationOfBenefit',
          timestamp: getCurrentDate(),
          total: bundles.length,
          entry: bundles,
        },
        paramMap['billable_period'],
        paramMap['allowed_amount'],
        paramMap['you_paid'],
        paramMap['insurance_paid'],
        paramMap['claim_types']
      );
    })();
  }
  return { status: 'unsupported' };
};
