# FHIR Server Cheatsheet

## 0. Accessing FHIR Server
You access FHIR server using REST API requests which are just standard HTTP calls (https://www.hl7.org/fhir/http.html).


Typically, this is done via:
1. A tool like Postman (https://www.postman.com/) to do the calls manually for testing
2. A command line tool like curl (https://curl.se/)
```shell
curl --location --request GET 'https://fhir.icanbwell.com/4_0_0/Patient' \
--header 'Authorization: Bearer {token here}' --header 'Content-Type: application/fhir+json'
```
3. Code in Javascript or Python or other programming language

Javascript Example:
```javascript
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://fhir.icanbwell.com/4_0_0/Patient");
xhr.setRequestHeader("Authorization", "Bearer {token here}");
xhr.setRequestHeader("Content-Type", "application/fhir+json");

xhr.send();
```
Python Example:
```python
import requests

url = "https://fhir.icanbwell.com/4_0_0/Patient"

payload={}
headers = {
    'Authorization': 'Bearer {token here}',
    'Content-Type': 'application/fhir+json'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

```
**Note:** Make sure you set `Content-Type: application/fhir+json` header in your HTTP call to the FHIR server.

## 1. Searching for Resources
You can search for resources by going to the /4_0_0/{resource} url e.g., 
https://fhir.icanbwell.com/4_0_0/Patient

**Note**: The server will return only 10 records unless the _count query parameter is specified per below.

### 1.1 Specifying how many records to return
Use the `_count` query parameter e.g., 
https://fhir.icanbwell.com/4_0_0/Practitioner?_count=10

The default is 10

FHIR Specification: https://www.hl7.org/fhir/search.html#count

### 1.2 Select only specific fields from the resource
Specify a comma separated list in `_elements` query parameter e.g.,
https://fhir.icanbwell.com/4_0_0/QuestionnaireResponse?_elements=id,meta

FHIR Specification: https://www.hl7.org/fhir/search.html#elements

### 1.3 Sorting records
Specify a comma separated list in `_sort` query parameter e.g.,
https://fhir.icanbwell.com/4_0_0/QuestionnaireResponse?_count=10&_sort=meta.lastUpdated (ascending)

To specify sorted a field descending, prepend the field name with `-`
https://fhir.icanbwell.com/4_0_0/QuestionnaireResponse?_count=10&_sort=-meta.lastUpdated 

Multiple sort fields can be specified:
https://fhir.icanbwell.com/4_0_0/QuestionnaireResponse?_count=10&_sort=-meta.lastUpdated,id 

FHIR Specification: https://www.hl7.org/fhir/search.html#_sort

### 1.4 Paging
To page through the data specify the `_count` and the `_getpageoffset` query parameters e.g., https://fhir.icanbwell.com/4_0_0/ExplanationOfBenefit?_count=2&_getpagesoffset=2

When you get no resources back then this means you've reached the end.

### 1.5 Additional Filters

| Filter By | Query Parameter | Example | Supported for Resources  |  |
|---|---|---|---|---|
| By ids or list of ids  | id=a,b | https://fhir.icanbwell.com/4_0_0/Practitioner?id=1194724047,546333  | All |  |
| By name | name=Jordan | https://fhir.icanbwell.com/4_0_0/Practitioner?name=Jordan | Patient, Practitioner |  |
| By family name | family=Jordan | https://fhir.icanbwell.com/4_0_0/Practitioner?family=Jordan | Patient, Practitioner |  |
| By identifier | identifier=system&#124;value | https://fhir.icanbwell.com/4_0_0/Practitioner/?identifier=http://hl7.org/fhir/sid/us-npi&#124;1487831681 | All |  |
| By source |  source=url | https://fhir.icanbwell.com/4_0_0/Practitioner?source=http://somehealth.org/insurance  | All |  |
| By security tag | _security=https://www.icanbwell.com/{access or owner or vendor}&#124;{value} | https://fhir.icanbwell.com/4_0_0/Organization?_security=https://www.icanbwell.com/access&#124;somehealth | All |  |
| By versionId | versionId=x | https://fhir.icanbwell.com/4_0_0/Practitioner?versionId=2 | All |  |
| Updated after a datetime | _lastUpdated=gt{date} | https://fhir.icanbwell.com/4_0_0/QuestionnaireResponse?_lastUpdated=gt2021-01-18 | All |  |
| Updated before a datetime | _lastUpdated=lt{date} | https://fhir.icanbwell.com/4_0_0/QuestionnaireResponse?_lastUpdated=lt2021-01-18 | All |  |
| Updated between dates | _lastUpdated=lt{date}&_lastUpdated=gt{date} | https://fhir.icanbwell.com/4_0_0/QuestionnaireResponse?_lastUpdated=gt2021-01-16&_lastUpdated=lt2021-01-17 | All |  |
| By missing field | {field_name}:missing={true or false} | https://fhir.icanbwell.com/4_0_0/ExplanationOfBenefit?patient:missing=true | Specific Resources |  |
| By field and value | {field name}={field value} | https://fhir.icanbwell.com/4_0_0/PractitionerRole?organization=-824888254&practitioner=1487831681 | All |  |

FHIR Specification: https://www.hl7.org/fhir/search.html.

### 1.6 Getting total count
By default, the FHIR server just returns the page of data was requested.  However, you can request to get the total count of records that meet your query by passing the `_total=accurate` query parameter e.g.,
https://fhir.icanbwell.com/4_0_0/Practitioner?source=http://somehealth.org/insurance&_count=10&_total=accurate

The total count will be returned in the `total` field of the `Bundle` that is returned.

**Note:** This is an expensive operation when the count of records that match your query is high.  It is recommended to only request `total` when it is actually needed.

FHIR Specification: https://www.hl7.org/fhir/search.html#total


## 2. Requesting a single resource
Add the id of the resource in the url e.g.,
https://fhir.icanbwell.com/4_0_0/HealthcareService/1952669236-MGB-MGTB

FHIR Specification: https://www.hl7.org/fhir/http.html#read

### 2.1 Getting history for a resource
Add `/_history` to a resource url to get the history of changes to that resource e.g.,
https://fhir.icanbwell.com/4_0_0/HealthcareService/1952669236-MGB-MGTB/_history

## 3. Creating a resource
There are two ways to do this:
1. (Recommended) Use the [$merge](merge.md) endpoint which handles both creating a new resource and updating an existing resource.  This is the recommended path to avoid the timing issue where someone else may add that resource between the time you checked the resource exists and sent the call to add it.
2. Use the POST method.  You can POST the resource as the body to /4_0_0/{resource} e.g., /4_0_0/Patient.

FHIR Specification: https://www.hl7.org/fhir/http.html#create

## 4. Updating a resource
There are two ways to do this:
1. (Recommended) Use the [$merge](merge.md) endpoint which handles both creating a new resource and updating an existing resource.  This is the recommended path to avoid the timing issue where someone else may update that resource between the time you checked the resource exists and sent the call to add it.
2. Use the PUT method.  You can PUT the resource as the body to /4_0_0/{resource}/{id} e.g., /4_0_0/Patient/123
   * **Note:** This will completely replace the existing resource

FHIR Specification: https://www.hl7.org/fhir/http.html#update

### 4.1 Updating a set of resources
The [$merge](merge.md) method supports sending a list of resources (which can be of different resource types).

## 5. Deleting a resource
The DELETE method allows you to logically delete a resource.  You can send a DELETE call to /4_0_0/{resource}/{id} e.g., /4_0_0/Patient/123

FHIR Specification: https://www.hl7.org/fhir/http.html#delete

## 6. Requesting a graph of related resources
Requesting resources and then requesting the related resources can result in many calls which can be slow.  The Helix FHIR server provides the $graph endpoint to do this in one call.

Use the [$graph](graph.md) endpoint to get a resource and the specified related resources. The requested graph is passed in as GraphDefinition in the body and all the resources are returned in a `Bundle`.

**Note:** You can pass in a list of resource ids in the `id` parameter to get the graphs for multiple resources.

For example: https://fhir.dev.bwell.zone/4_0_0/Organization/$graph?id=733797173,1234&contained=true


## 7. Authentication
FHIR Server uses OAuth Authentication.  You can authenticate either:
1. Service to Service via a `client id` and `client secret`
2. As a User via a `user id` and `password`

See [Security](security.md) for details.

## 8. Authorization
FHIR Server uses the SMART on FHIR scopes:
1. user/{resource}.{read or write} e.g., `user/Patient.read`
   * This determines what resource types you can access and whether you can read or write (or both)
2. access/{access tag}.* e.g., `access/my_client.*`
   * This determines which resources you can access within a resource type.

See [Security](security.md) for details.

## Fhir Client SDK
This is a python package that can make it easier to talk to FHIR servers.  Note this is optional; You can talk to our FHIR server using standard HTTP REST API.

https://github.com/icanbwell/helix.fhir.client.sdk

This SDK encapsulates all the aspects of calling the FHIR API so you can just call Python functions.

The SDK handles:
1. Authentication to FHIR server
2. Renewing access token when it expires
3. Retry when there are transient errors
4. Un-bundling the resources received from FHIR server
5. Paging
