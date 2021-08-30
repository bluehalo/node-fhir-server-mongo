# Security

### 1. Get OAuth Url for a FHIR server

Helix FHIR server supports the `well-known confiuration` feature so you can get the token-url from the FHIR server.  (The helix fhir client sdk   does this automatically)

https://fhir.icanbwell.com/.well-known/smart-configuration

### 2. Authentication

The b.well FHIR server implements the OAuth2 Client Credentials workflow (https://www.oauth.com/oauth2-servers/access-tokens/client-credentials/).

#### 2.1 Steps
1. Caller calls the FHIR server without Access Token
2. FHIR server returns `Unauthorized` error code
3. (Note: Step 1 & 2 can be skipped by the caller by acquiring an access token before calling the FHIR server)
4. Caller calls OAuth server token url specified in well-known configuration and passes in their `client id` and `client secret`.
5. OAuth server returns Access Token
6. Caller calls the FHIR server passing the Access Token (e.g., https://fhir.icanbwell.com/4_0_0/Patient)
7. FHIR Server decrypts and verifies the Access Token using the public keys from AWS Cognito.  It also checks the Access Token is not expired.
8. Then we continue with the Authorization flow below

Note: The Access Token expires so if the caller gets an `Unauthorized` error code on any call to the FHIR server they should get a new Access Token from AWS Cognito.

#### 2.2 Example Code
Javascript:
```javascript
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://fhir-bwell.auth.us-east-1.amazoncognito.com/oauth2/token',
  'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  form: {
    'grant_type': 'client_credentials',
    'scope': 'user/*.read',
    'client_id': '[put client id here]',
    'client_secret': '[put client secret here]'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```
Python:

We recommend using the FHIR Client SDK: https://github.com/icanbwell/helix.fhir.client.sdk

### 3. Authorization
The b.well FHIR server implements the SMART on FHIR authorization workflow: http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html

**Note** Currently we only support “user” and “access” scopes.

#### 3.1 Steps
1. After the Authentication part above is done
2. FHIR Server extracts the scopes from the Access Token
3. FHIR Server checks that the scopes in the Access Token allow the operation the caller is requesting
4. If no scope allows the operation then an error is returned

#### 3.2 Example
Javascript:
```javascript
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://fhir.icanbwell.com/4_0_0/Patient',
  'headers': {
    'Authorization': 'Bearer [put access token from above here]'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```
Python:

We recommend using the FHIR Client SDK: https://github.com/icanbwell/helix.fhir.client.sdk

### 4. Access Control
FHIR Server has two mechanisms to control access:
1. Control access by resource
2. Control access by security tags

 
Both mechanisms are implemented using the scopes mechanism in SMART on FHIR.

 
When a user authenticates with the FHIR server they pass in a token they have received after authenticating with OAuth Server.  See above for details.

This token contains a list of scopes that have been granted to this `client_id` in OAuth server.  Note that the token is encrypted by OAuth server using a private key so it is not possible for clients to fake the scopes.


#### 4.1 Control access by resource
FHIR server looks for scopes that start with “user/”.  These are in the form of user/<resource|*>.<read|write|*> e.g., user/Practitioner.read.  This scope grants the client the permission to read the Practitioner resources.

In addition we support wildcard scopes e.g., user/*.* or user/*.read.  The former gives the user the permission to read or write any resource and the latter gives the user the right to read any resource.

 

#### 4.2 Control access by security tags
**Note**: This is an enhancement that we've made to FHIR.

In addition to giving users permissions to access resources, we can also control what data in those resources the user can access.  All resources in the b.well FHIR server must specify access tags. 

The FHIR server looks for scopes that start with “access/”.  These are in the form access/<access code>.* e.g., access/somehealth.*  This scope grants the user access to resources where the security access tag is set to somehealth.

A user can have multiple access scopes and they will have permission to resources that match EITHER access code.

#### 4.3 Access
Note that the final access for a user is a combination of both of the above methods. 


#### 4.4 Examples

##### 4.4.1 Example 1
A user has scopes:
```
user/Practitioner.read user/Practitioner.write user/Organization.read access/somehealth access/goodhealth
``` 

This means:
1. User can read Practitioner and Organization resources
2. User can write to Practitioner resource only
3. When reading or writing, the user can access any resource where the security access tag is somehealth or goodhealth only

 

##### 4.4.2 Example 2 
A user has scopes:
```
user/*.* access/*.*
```
This means the user can read/write ANY resource and there is no restriction by security tags either.

 
### 5. Multiple scopes
NOTE: Multiple scopes must be separate by space (NOT comma) per the OAuth spec: https://datatracker.ietf.org/doc/html/rfc6749#section-3.3
