const { getResources } = require('../../common');
const { merge } = require('../../../operations/merge/merge');

function mapParticipants(members) {
  const result = [];
  members.forEach((m) => {
    result.push({
      id: m.id,
      role: m.role,
      member: { reference: m.member },
      onBehalfOf: { reference: m.onBehalfOf },
      period: m.period,
    });
  });
  return result;
}

function mapCareTeam(team) {
  return {
    resourceType: 'CareTeam',
    id: team.id,
    implicitRules: team.implicitRules,
    language: team.language,
    text: team.text,
    contained: [{ reference: team.contained }],
    identifier: team.identifier,
    status: team.code,
    category: team.category,
    name: team.name,
    subject: { reference: team.subject },
    encounter: { reference: team.encounter },
    period: team.period,
    participant: mapParticipants(team.participant),
    reasonCode: team.reasonCode,
    reasonReference: team.reasonReference,
    managingOrganization: { reference: team.managingOrganization },
    telecom: team.telecom,
    note: team.note,
  };
}

module.exports = {
  Mutation: {
    updatePreferredProviders:
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
        // create care team
        const careTeam = mapCareTeam(args.team);
        const result = await merge(
          { ...args, base_version: '4_0_0' },
          context.user,
          context.scope,
          [careTeam],
          '',
          'CareTeam',
          'CareTeam'
        );
        if (result !== undefined && !result[0].operationOutcome === undefined) {
          throw new Error(`Unable to update care team data for ${args.patientId}`);
        }
        return patientToChange;
      },
  },
};