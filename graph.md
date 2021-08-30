# FHIR $graph endpoint

The Helix FHIR server supports the $graph endpoint of FHIR specification (https://www.hl7.org/fhir/resource-operation-graph.html).  

The $graph endpoint accepts a GraphDefinition resource: https://www.hl7.org/fhir/graphdefinition.html.

The $graph endpoint creates a graph per the passed in GraphDefinition and returns the whole graph in one call.

Note: Make sure you set `Content-Type: application/fhir+json` in the HTTP call.

### Examples
Here are the examples graphs that $everything uses underneath: https://github.com/icanbwell/fhir-server/tree/master/src/graphs

### Implementation
here's the $graph implementation: https://github.com/icanbwell/fhir-server/blob/16990bd500d316300ef36d1a305cd8d255e42935/src/services/base/base.service.js#L2305

and unit test for it: https://github.com/icanbwell/fhir-server/tree/master/src/tests/organization/graph

#### GraphDefinition
The documentation for GraphDefinition(https://www.hl7.org/fhir/graphdefinition.html) on the FHIR website is not very good so here’s more detail:

Take an example GraphDefinition below.

```json
{
  "resourceType": "GraphDefinition",
  "id": "o",
  "name": "organization_everything",
  "status": "active",
  "start": "Organization",
  "link": [
    {
      "target": [
        {
          "type": "Location",
          "params": "managingOrganization={ref}"
        }
      ]
    },
    {
      "target": [
        {
          "type": "HealthcareService",
          "params": "providedBy={ref}"
        }
      ]
    },
    {
      "target": [
        {
          "type": "OrganizationAffiliation",
          "params": "participatingOrganization={ref}"
        }
      ]
    }
  ]
}
```

`"start": "Organization"` means which resource we should start from which is the parent resource for any related resources..

`link` means related resources (link can be nested as explained below)

In this example, we’re requested 3 linked resources to Organization.

```json
{
      "target": [
        {
          "type": "Location",
          "params": "managingOrganization={ref}"
        }
      ]
    }
```

This means the linked resource is a `Location`.  The linkage is that the `managingOrganization` reference of the `Location` resource should point to the parent `Organization` resource.


```json
   {
      "target": [
        {
          "type": "HealthcareService",
          "params": "providedBy={ref}"
        }
      ]
    }
```

This means the linked resource is a `HealthcareService`. The linkage is that the `providedBy` reference of the `HealthcareService` should point to the parent `Organization` resource.

The above are all examples of reverse linkage where the parent resource, `Organization`, does not have a reference to the linked resource but the linked resource has a reference back to the parent resource.

The other type of linkage is forward reference where the parent resource has a reference to linked resource.  This is an example of forward reference:
```json
{
  "path": "organization",
  "target": [
    {
      "type": "Organization"
    }
  ]
}
```

This means the `organization` property in the parent resource is a reference to a resource of type `Organization`.

Linked resources can be nested.  For example, this graph has nested linked resources.
```json
{
  "resourceType": "GraphDefinition",
  "id": "o",
  "name": "provider_everything",
  "status": "active",
  "start": "Practitioner",
  "link": [
    {
      "description": "Practitioner Roles for this Practitioner",
      "target": [
        {
          "type": "PractitionerRole",
          "params": "practitioner={ref}",
          "link": [
            {
              "path": "organization",
              "target": [
                {
                  "type": "Organization"
                }
              ]
            },
            {
              "path": "location[x]",
              "target": [
                {
                  "type": "Location"
                }
              ]
            },
            {
              "path": "healthcareService[x]",
              "target": [
                {
                  "type": "HealthcareService"
                }
              ]
            },
            {
              "path": "extension.extension:url=plan",
              "target": [
                {
                  "link": [
                    {
                      "path": "valueReference",
                      "target": [
                        {
                          "type": "InsurancePlan"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Filtering
Filtering can also be done:
```json
{
  "path": "extension.extension:url=plan"
}
```

This means return extensions where url property is equal to “plan”.

### Contained query parameter
By default, the FHIR returns all the related resources in the top level bundle.  
However if you pass in the `contained` query parameter then the FHIR server will put the related resources in a `contained` field under each resource.

For example: https://fhir.dev.bwell.zone/4_0_0/Organization/$graph?id=733797173,1234&contained=true

FHIR Specification: https://www.hl7.org/fhir/references.html#contained
