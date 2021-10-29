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
        ]
    }
};
