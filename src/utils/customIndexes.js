/**
 * List of custom indexes to add.  (* means these indexes should be applied to all collections)
 * @type {{customIndexes: {"*": [{id_1: string[]}, {"meta.lastUpdated_1": string[]}, {"meta.source_1": string[]}, {"meta.security.system_1_meta.security.code_1": string[]}], PractitionerRole_4_0_0: [{"practitioner.reference_1": string[]}, {"organization.reference_1": string[]}, {"location.reference_1": string[]}]}}}
 */
module.exports = {
    customIndexes: {
        '*': [
            {
                'id_1': [
                    'id'
                ]
            },
            {
                'meta.lastUpdated_1': [
                    'meta.lastUpdated'
                ]
            },
            {
                'meta.source_1': [
                    'meta.source'
                ]
            },
            {
                'meta.security.system_1_meta.security.code_1': [
                    'meta.security.system',
                    'meta.security.code'
                ]
            }
        ],
        'PractitionerRole_4_0_0': [
            {
                'practitioner.reference_1': [
                    'practitioner.reference'
                ],
            },
            {
                'organization.reference_1': [
                    'organization.reference'
                ],
            },
            {
                'location.reference_1': [
                    'location.reference'
                ],
            }
        ],
        'AuditEvent_4_0_0': [
            {
                'helix_auditEvent_index_1': [
                    'meta.security.system',
                    'meta.security.code',
                    'id',
                    'meta.lastUpdated'
                ],
                'helix_auditEvent_index_recorded': [
                    'meta.security.system',
                    'meta.security.code',
                    'id',
                    'recorded'
                ],
            }
        ]
    }
};
