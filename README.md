`@asymmetrik/node-fhir-server-mongo` [![Build Status](https://travis-ci.org/Asymmetrik/node-fhir-server-mongo.svg?branch=master)](https://travis-ci.org/Asymmetrik/node-fhir-server-mongo) [![Known Vulnerabilities](https://snyk.io/test/github/asymmetrik/node-fhir-server-mongo/badge.svg?targetFile=package.json)](https://snyk.io/test/github/asymmetrik/node-fhir-server-mongo?targetFile=package.json)
====================================

## Intro
This project is an example project built on `@asymmetrik/node-fhir-server-core` and has a MongoDB back end storing sample data. It's built with the ability to run in docker or node.js. To get started developing in Docker, see [Getting Started with Docker](#getting-started-with-docker). To get started developing with Node.js and Mongo, see [Getting Started with Node](#getting-started-with-node).  You can serve multiple versions of FHIR with just one server.  By default, DSTU2 (1.0.2) and STU3 (3.0.1) is enabled.  You can choose to support both versions or just one version by editing the config.

## Getting Started with Docker

1. Install the latest [Docker Community Edition](https://www.docker.com/community-edition) for your OS if you do not already have it installed.
2. Run `docker-compose up`.

## Getting Started with Node

1. Install the latest LTS for [Node.js](https://nodejs.org/en/) if you do not already have it installed.
2. Install the latest [Mongo Community Edition](https://docs.mongodb.com/manual/administration/install-community/) if you do not already have it installed.
3. Make sure the default values defined in `env.json` are valid.
4. Run `yarn` or `npm install`.
5. Run `yarn start` or `npm run start`.

## Next Steps
Once you have this up and running. You should see the following output:

```shell
... - info: App listening on port: 3000 # or whichever port you used
... - info: FHIR Server successfully started.
```

At this point you can now start testing the endpoints. Depending what profiles you opt into, certain routes will be available. You can view the routes enabled based on which service methods you provide over at [`@asymmetrik/node-fhir-server-core`](https://github.com/Asymmetrik/node-fhir-server-core#profiles). 

The url the server will be running at will partially depend on your configuration. For local development, the default is `http://localhost:3000`. You can of course change the port in the `docker-compose.yml` or the `env.json`. You can also enable https by providing SSL certs. If you want to do this you must first generate them, see [Generate self signed certs](https://github.com/Asymmetrik/node-fhir-server-core/blob/master/.github/CONTRIBUTING.md#generate-self-signed-certs). Then, add the path to them in your config by setting `SSL_KEY` and `SSL_CERT` as ENV variable's, adding them in `docker-compose.yml`, or adding them to `env.json`. This will allow the app to run on `https://localhost:3000`. Note the link is for generating self signed certs, you should not use those for production. You can verify the path is set correctly by logging out the fhirServerConfig in `index.js`.


### Lets give this a try on our server.
Using any request builder (i.e. Postman), let's create a new patient.

#### STU3 Patient
```
Create Patient

PUT /3_0_1/Patient/hhPTufqen3Qp-997382 HTTP/1.1
Host: localhost:3000
Content-Type: application/fhir+json
Cache-Control: no-cache

{
  "resourceType" : "Patient",
  "id" : "hhPTufqen3Qp-997382",
  "text" : {
    "status" : "generated",
    "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table><tbody><tr><td>Name</td><td>Peter James <b>Chalmers</b> (&quot;Jim&quot;)</td></tr><tr><td>Address</td><td>534 Erewhon, Pleasantville, Vic, 3999</td></tr><tr><td>Contacts</td><td>Home: unknown. Work: (03) 5555 6473</td></tr><tr><td>Id</td><td>MRN: 12345 (Acme Healthcare)</td></tr></tbody></table>    </div>"
  },
  "identifier" : [ {
    "use" : "usual",
    "type" : {
      "coding" : [ {
        "system" : "http://hl7.org/fhir/v2/0203",
        "code" : "MR"
      } ]
    },
    "system" : "urn:oid:1.2.36.146.595.217.0.1",
    "value" : "hhPTufqen3Qp997382",
    "period" : {
      "start" : "2001-05-06"
    },
    "assigner" : {
      "display" : "Acme Healthcare"
    }
  } ],
  "active" : true,
  "name" : [ {
    "use" : "official",
    "family" : "Smith",
    "given" : [ "Peter", "James" ]
  }, {
    "use" : "usual",
    "given" : [ "Jim" ]
  } ],
  "telecom" : [ {
    "use" : "home"
  }, {
    "system" : "phone",
    "value" : "(07) 7296 7296",
    "use" : "work"
  } ],
  "gender" : "male",
  "birthDate" : "1974-12-25",
  "deceasedBoolean" : false,
  "address" : [ {
    "use" : "home",
    "line" : [ "255 Somewhere Rd" ],
    "city" : "Pleasant Valley",
    "state" : "Somewhere",
    "postalCode" : "3999"
  } ],
  "contact" : [ {
    "relationship" : [ {
      "coding" : [ {
        "system" : "http://hl7.org/fhir/v2/0131",
        "code" : "CP"
      } ]
    } ],
    "name" : {
      "family" : "Smith",
      "given" : [ "Jane" ]
    },
    "telecom" : [ {
      "system" : "phone",
      "value" : "+33 (237) 123456"
    } ],
    "gender" : "female",
    "period" : {
      "start" : "2012"
    }
  } ],
  "managingOrganization" : {
    "reference" : "Organization/hhPTufqen3Qp-997382-RZq1u"
  }
}

```

```
Read Patient


GET /3_0_1/Patient/hhPTufqen3Qp-997382 HTTP/1.1
Host: localhost:3000
Content-Type: application/fhir+json
Cache-Control: no-cache

```



#### DSTU2 Patient
```
Create Patient

PUT /1_0_2/Patient/12345997382 HTTP/1.1
Host: localhost:3000
Content-Type: application/json+fhir;charset=UTF-8
Cache-Control: no-cache

{
  "resourceType" : "Patient",
  "id" : "12345997382",
  "text" : {
    "status" : "generated",
    "div" : "<div><table><tbody><tr><td>Name</td><td>Peter James <b>Chalmers</b> (&quot;Jim&quot;)</td></tr><tr><td>Address</td><td>534 Erewhon, Pleasantville, Vic, 3999</td></tr><tr><td>Contacts</td><td>Home: unknown. Work: (03) 5555 6473</td></tr><tr><td>Id</td><td>MRN: 12345 (Acme Healthcare)</td></tr></tbody></table>    </div>"
  },
  "identifier" : [ {
    "fhir_comments" : [ "   MRN assigned by ACME healthcare on 6-May 2001   " ],
    "use" : "usual",
    "type" : {
      "coding" : [ {
        "system" : "http://hl7.org/fhir/v2/0203",
        "code" : "MR"
      } ]
    },
    "system" : "urn:oid:1.2.36.146.595.217.0.1",
    "value" : "12345997382",
    "period" : {
      "start" : "2001-05-06"
    },
    "assigner" : {
      "display" : "Acme Healthcare"
    }
  } ],
  "active" : true,
  "name" : [ {
    "fhir_comments" : [ "   Peter James Chalmers, but called \"Jim\"   " ],
    "use" : "official",
    "family" : [ "Chalmers" ],
    "given" : [ "Peter", "James" ]
  }, {
    "use" : "usual",
    "given" : [ "Jim" ]
  } ],
  "telecom" : [ {
    "fhir_comments" : [ "   home communication details aren't known   " ],
    "use" : "home"
  }, {
    "system" : "phone",
    "value" : "(07) 7296 7296",
    "use" : "work"
  } ],
  "gender" : "male",
  "_gender" : {
    "fhir_comments" : [ "   use FHIR code system for male / female   " ]
  },
  "birthDate" : "1974-12-25",
  "deceasedBoolean" : false,
  "address" : [ {
    "use" : "home",
    "line" : [ "255 Erewhon St" ],
    "city" : "PleasantVille",
    "state" : "Vic",
    "postalCode" : "3999"
  } ],
  "contact" : [ {
    "relationship" : [ {
      "coding" : [ {
        "system" : "http://hl7.org/fhir/patient-contact-relationship",
        "code" : "partner"
      } ]
    } ],
    "name" : {
      "family" : [ "du", "Marché" ],
      "given" : [ "Bénédicte" ]
    },
    "telecom" : [ {
      "system" : "phone",8
      "value" : "+33 (237) 123456"
    } ],
    "gender" : "female",
    "period" : {
      "start" : "2012",
      "_start" : {
        "fhir_comments" : [ "   The contact relationship started in 2012   " ]
      }
    }
  } ],
  "managingOrganization" : {
    "reference" : "Organization/1"
  }
}
```

```
Read Patient

GET /1_0_2/Patient/12345997382 HTTP/1.1
Host: localhost:3000
Content-Type: application/json+fhir;charset=UTF-8
Cache-Control: no-cache

```

## License
`@asymmetrik/fhir-server-mongo` is [MIT licensed](./LICENSE).
