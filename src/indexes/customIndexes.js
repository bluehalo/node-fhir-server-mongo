/**
 * List of custom indexes to add.  (* means these indexes should be applied to all collections)
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
                'security.system_code_1': [
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
