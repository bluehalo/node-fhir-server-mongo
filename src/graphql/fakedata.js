module.exports.patients = [
    {
        id: '1',
        name: [
            {
                use: 'active',
                family: 'Qureshi',
                given: [
                    'Imran'
                ]
            }
        ]
    },
    {
        id: '2',
        name: [
            {
                use: 'active',
                family: 'Jones',
                given: [
                    'Jim'
                ]
            }
        ]
    }
];

module.exports.explanationOfBenefits = [
    {
        id: '101',
        status: 'active',
        use: 'usual',
        patient_reference: '1',
        item: [
            {
                sequence: 1,
                productOrService: {
                    coding: [
                        {
                            system: 'http://www.foo.com',
                            code: '12344'
                        }
                    ],
                    text: 'my coding'
                },
                quantity: 2.0
            }
        ]
    },
    {
        id: '102',
        status: 'active',
        use: 'usual',
        patient_reference: '2'
    },
    {
        id: '103',
        status: 'active',
        use: 'usual',
        patient_reference: '1'
    }
];
