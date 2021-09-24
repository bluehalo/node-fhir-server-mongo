const {patients, explanationOfBenefits} = require('../fakedata');
// const {search} = require('../../operations/search/search');

module.exports = {
    Query: {
        // eslint-disable-next-line no-unused-vars
        patients: async (parent, args, context, info) => {
            return patients;
            // return search(args, 'user', 'user/*.read access/*.*', 'Patient', 'Patient_4_0_0');
        },
        // eslint-disable-next-line no-unused-vars
        patient: async (parent, args, context, info) => {
            return patients.filter(x => x.id === args.id)[0];
        },
    },
    Patient: {
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefit: async (parent, args, context, info) => {
            return explanationOfBenefits.filter(x => x.patient_reference === parent.id);
        },
    },
};
