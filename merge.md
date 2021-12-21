# FHIR $merge endpoint

The b.well Helix FHIR server implements the $merge endpoint.  This endpoint allows clients to send a list of resources (which do not need to be of the same type) and the FHIR server will compare those to the data it has and choose to:
1. Add a new resource
2. Update an existing resource

3. Ignore the request because the resource sent is same as the resource in the FHIR server already

Note: The client can send ONLY the properties it knows about the resource and the FHIR server will merge that with the properties it already has about the resource.  Hence there is no need for the client to retrieve the whole resource from FHIR server, update the properties and send the whole resource back.  This also avoids the timing issue where the resource may have been changed by another client between the client retrieving the resource and sending an updated resource.

Note: Make sure you set `Content-Type: application/fhir+json` in your HTTP call.

Note: Any insert or update requires write permission on that resource.


### Payload
The $merge endpoint accepts a FHIR Bundle resource:  https://www.hl7.org/fhir/bundle.html

For each resource in the bundle, the FHIR server checks:

1. If a resource with that id exists in the FHIR server.  If not, the FHIR server adds that resource.
2. If the data the client has sent is exactly the same as the data already in the FHIR server.  If yes, the FHIR server ignores the request.
3. The FHIR server compares the resource the client has sent with the resource in the FHIR server and creates a patch containing any changes.  It then applies this patch.  Note that since a patch is created, the client can send ONLY the properties it wants to change and not the whole resource.
    * If the change is in an array property then:
        * FHIR server tries to find a match on the id of the item in the array.  If a match is found then the FHIR server updates that item in the array.
        * FHIR server tries to find a match on sequence of the item in the array.  If a match is found then the FHIR server updates that item in the array.
        * If no match is found then the FHIR server adds the item as a new item at the end of the array.
        * Note: If an item does not have id or sequence AND it does not match any existing item exactly then the FHIR server will create a new item. There is no way for it to know that you want to update an item vs add an item.  Hence we recommend using id or sequence on items in an array whenever possible to minimize the chance of duplications in array items.

    * Note this is done in a recursive manner so changes are detected in array any levels deep.

4. The FHIR server returns a list showing the outcome for each passed in resource showing:
    * id
    * created: whether this resource was created
    * updated: whether this resource was updated
    * resource_version: current version of the resource after this update

### Notes:
A FHIR resource must be specified in the URL in order for the $merge call to be processed.
    * ex. https://fhir-sandbox.dev.bwell.zone/4_0_0/Encounter/$merge (in this example, 'Encounter' is the FHIR resource)
    * The FHIR resource passed in the URL is heterogeneous, although in the example we use 'Encounter' as the FHIR resource, that does not mean we can only pass in Encounters within the FHIR resource bundle.  A user can pass in any valid FHIR resources within the bundle. (sample here: https://www.npoint.io/docs/f7efe4bb5e42355aaa1a).
  
### Implementation in FHIR server
[src/operations/merge/merge.js](src/operations/merge/merge.js)


### unit tests
[src/tests/claims](src/tests/claims)

