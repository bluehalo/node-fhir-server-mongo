# Contributing
You will need:
1. Docker Desktop
2. Node.js 16.13


Run `make lint` to do lint checking

Run `make tests` to run all the tests locally

To add a new package or update version of a package, edit package.json and then run `make update` to regenerate `yarn.lock` file.

Run `make up` to bring up the fhir server in docker on your local machine.

## Indexing
Indexes are defined here and you can add new ones: 
[customIndexes.js](src/utils/customIndexes.js)

Indexes are automatically created when a new resource type is added to the server (if the `CREATE_INDEX_ON_COLLECTION_CREATION` environment variable is set).

If you add a new index to an existing collection then you can run indexing by going to `/index/run` url endpoint.


## Query filters
Custom query filters are defined here: [customQueries.js](src/operations/search/query/customQueries.js)


## Index hinting
Some mongo implementations (such as AWS DocumentDB) are not very good at selecting an index to serve a query.  Hence we've added an index hinting feature that compares the columns in the query with the existing indexes and adds a hint to mongo to use that index.  This feature can be turned on by setting the `SET_INDEX_HINTS` environment variable.
