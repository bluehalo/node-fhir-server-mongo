const {getResources} = require('../../common');

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
    },
};
