const {getResources} = require('../../common');
const {remove} = require('../../../../operations/remove/remove');
const {merge} = require('../../../../operations/merge/merge');
const {getRequestInfo} = require('../../requestInfoHelper');

/**
    method to match general practitioners to an id and remove from the provided list
    @param {array} arr the list of practitioners to inspect
    @param {string} id the id to remove from the list
    @returns {array} the collection of ids after processing
 */
function removeAllGeneralPractitioner(arr, id) {
  var i = 0;
  if (arr && id){
    while (i < arr.length) {
        // eslint-disable-next-line security/detect-object-injection
        if (arr[i].reference.indexOf(id, id.length - arr[i].reference.length) !== -1) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    }
  return arr;
}

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
                const deletePractitioner = args.remove;
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
                if (patients && patients.length === 0) {
                    throw new Error(`Patient not found ${args.patientId}`);
                }
                const patientToChange = patients[0];
                if (deletePractitioner && patientToChange.generalPractitioner === null){
                        return patientToChange;
                } else if (deletePractitioner) {
                    patientToChange.generalPractitioner = removeAllGeneralPractitioner(patientToChange.generalPractitioner, args.practitionerId);
                    const requestInfo = getRequestInfo(context);
                    await remove(
                        requestInfo,
                        {...args, base_version: '4_0_0',
                        id: args.patientId},
                        'Patient',
                        'Patient'
                    );
                } else {
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
                    if (practitioners && practitioners.length === 0) {
                        throw new Error(`Practitioner not found ${args.practitionerId}`);
                    }
                    patientToChange.generalPractitioner = [{reference: `Practitioner/${practitioners[0].id}`}];
                }
                /**
                 * @type {import('../../../../utils/requestInfo').RequestInfo}
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
