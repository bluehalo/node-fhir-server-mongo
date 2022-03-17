const {getResources} = require('../../common');
const {getUuid} = require('../../../../utils/uid.util');
const {merge} = require('../../../../operations/merge/merge');
const {getRequestInfo} = require('../../requestInfoHelper');

function mapParticipants(members) {
    const result = [];
    members.forEach((m) => {
        result.push({
            id: m.id,
            role: m.role,
            member: {reference: m.member},
            onBehalfOf: {reference: m.onBehalfOf},
            period: m.period,
        });
    });
    return result;
}

function mapManagingOrganization(organizations) {
    const result = [];
    organizations.forEach((org) => {
        result.push({
            reference: org
        });
    });

    return result;
}

function mapCareTeam(team) {
    const careTeamMap = {
        resourceType: 'CareTeam',
        id: team.id,
        meta: team.meta,
        implicitRules: team.implicitRules,
        language: team.language,
        text: team.text,
        identifier: team.identifier,
        status: team.code,
        category: team.category,
        name: team.name,
        subject: {reference: team.subject},
        encounter: {reference: team.encounter},
        period: team.period,
        participant: mapParticipants(team.participant),
        reasonCode: team.reasonCode,
        reasonReference: team.reasonReference,
        telecom: team.telecom,
        note: team.note,
    };

    if (team.contained) {
        careTeamMap.contained = [team.contained];
    }

    if (team.managingOrganization) {
        careTeamMap.managingOrganization = mapManagingOrganization(team.managingOrganization);
    }

    return careTeamMap;
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
                if (!careTeam.id) {
                    careTeam.id = getUuid(careTeam);
                }
                /**
                 * @type {import('../../../../utils/requestInfo').RequestInfo}
                 */
                const requestInfo = getRequestInfo(context);
                requestInfo.body = [careTeam];
                const result = await merge(
                    requestInfo,
                    {...args, base_version: '4_0_0'},
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
