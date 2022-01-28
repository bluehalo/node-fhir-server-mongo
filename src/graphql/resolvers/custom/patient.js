const {getResources} = require('../../common');
const {merge} = require('../../../operations/merge/merge');
const {getRequestInfo} = require('../../requestInfoHelper');

module.exports = {
    Patient: {
        // eslint-disable-next-line no-unused-vars
        explanationOfBenefit: async (parent, args, context, info) => {
            return await getResources(
                parent,
                {
                    ...args,
                    'patient': parent.id,
                },
                context,
                info,
                'ExplanationOfBenefit'
            );
        },
        // eslint-disable-next-line no-unused-vars
        allergyIntolerance: async (parent, args, context, info) => {
            return await getResources(
                parent,
                {
                    ...args,
                    'patient': parent.id,
                },
                context,
                info,
                'AllergyIntolerance'
            );
        },
        // eslint-disable-next-line no-unused-vars
        condition: async (parent, args, context, info) => {
            return await getResources(
                parent,
                {
                    ...args,
                    'patient': parent.id,
                },
                context,
                info,
                'Condition'
            );
        },
        // eslint-disable-next-line no-unused-vars
        carePlan: async (parent, args, context, info) => {
            return await getResources(
                parent,
                {
                    ...args,
                    'patient': parent.id,
                },
                context,
                info,
                'CarePlan'
            );
        },
    },
    Mutation: {
        updateGeneralPractitioner:
        // eslint-disable-next-line no-unused-vars
            async (parent, args, context, info) => {
                const patients = await getResources(
                    parent,
                    {
                        ...args,
                        id: args.patientId,
                    },
                    context,
                    info,
                    'Patient'
                );
                if (patients.length === 0) {
                    throw new Error(`Patient not found ${args.patientId}`);
                }
                const patientToChange = patients[0];
                const practitioners = await getResources(
                    parent,
                    {
                        ...args,
                        id: args.practitionerId,
                    },
                    context,
                    info,
                    'Practitioner'
                );
                if (practitioners.length === 0) {
                    throw new Error(`Practitioner not found ${args.practitionerId}`);
                }
                patientToChange.generalPractitioner = [{reference: `Practitioner/${practitioners[0].id}`}];
                /**
                 * @type {import('../../../utils/requestInfo').RequestInfo}
                 */
                const requestInfo = getRequestInfo(context);
                requestInfo.body = [patientToChange];

                const result = await merge(
                    requestInfo,
                    {...args, base_version: '4_0_0'},
                    'Patient',
                    'Patient'
                );
                if (result !== undefined && !result[0].operationOutcome === undefined) {
                    throw new Error(`Unable to update patient ${args.patientId}`);
                }
                return patientToChange;
            },
    },
};
