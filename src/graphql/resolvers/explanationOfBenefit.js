const {patients, explanationOfBenefits} = require('../fakedata');

module.exports = {
  Query: {
    // eslint-disable-next-line no-unused-vars
    explanationOfBenefits: async (parent, args, context, info) => { return explanationOfBenefits;},
    // eslint-disable-next-line no-unused-vars
    explanationOfBenefit: async (parent, args, context, info) => { return explanationOfBenefits.filter(x => x.id === args.id)[0];},
  },
  ExplanationOfBenefit: {
    // eslint-disable-next-line no-unused-vars
    patient: async (parent, args, context, info) => {
      return patients.filter(x => x.id === parent.patient_reference)[0];
    }
  },
};
