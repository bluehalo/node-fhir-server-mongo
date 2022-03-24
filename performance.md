# Optimizing Performance and Reliability

Every FHIR server uses FHIR APIs (https://www.hl7.org/fhir/http.html).  
FHIR APIs are REST APIs that work on top of HTTP.

HTTP based APIs have a few limitations:
1. The size of a request and a response are limited by HTTP servers.
2. HTTP servers and proxies in between can drop connections
3. HTTP requests can sometimes get lost in the internet

As a result, the standard pattern in HTTP is to make multiple HTTP calls for different pages of data 
instead of requesting all the data in one HTTP request.

If done, in a serial manner, where you request page 1, wait for the response and 
then request page 2, this can result in slow performance.

In addition, just like any data store that is big, accessing data when you're not leveraging 
indexes on large tables can result in slow performance and timeouts 
(due to HTTP servers and proxies timing out long requests as mentioned above)

## FHIR client sdk
Dealing with the intricacies of downloading large amounts of data over REST APIs can be hard.  
Implementing a proper async and parallel pattern can also be challenging.

We provide an open source client Python SDK for FHIR that implements all the patterns below and more.  
If you are developing in Python we highly recommend using this SDK since it will, most likely, give you the best 
performance and reliability along with ease of use.

This can be included in your Python code via the standard pip mechanism:

`pip install helix.fhir.client.sdk`

This client sdk is open source, so you can explore all the code here: https://github.com/icanbwell/helix.fhir.client.sdk

If you are not using Python, you can still see the code to learn how to implement the patterns below.  
(We are working on a Javascript SDK so if you're interested let us know.)

You can find a sample project that uses this Python SDK here: 
https://github.com/icanbwell/fhir-server-performance.  
Note that your code does not have to be async to use the fhir client sdk. 
Using the patterns below it can download 100,000 events in 15 minutes over an average connection.  
(Events are, by far, the largest resource in th FHIR server)


## Recommended Patterns

### Retry Pattern
We do highly recommend using a Retry pattern since an HTTP request is not guaranteed to complete due to
limitations of HTTP.
The client SDK above already implements this but if you want to implement it yourself we recommend 
the "Retry with Exponential Backoff" pattern: 
https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/implement-retries-exponential-backoff

### Recommended Pattern for uncommon resources
FHIR resources that are uncommon can be retrieved through any pattern however we recommend, 
when possible, to always implement the better patterns since the data size may increase over time.

### Recommended Pattern for common resources (except AuditEvent)
1. Send your query filter but only request the ids of the resources that match your filter.
This can be done via the `_elements` query parameter. 
In many cases, this request can be fulfilled from data store indexes.
2. Use parallel processing (e.g., threads) so you are making multiple requests at a time.  
For example, you can request pages 1,2 and 3 at the same time.  
We recommend setting a page size of 10,000 in your requests.
We recommend doing 10 parallel requests.  Too few will not give you a lot of benefit.  Too many will slow down your system and result in timeouts.
3. Use an async pattern so you're not blocking.  This will give you better throughput.
4. Once you have the ids, divide up the ids into chunks.  
We recommend a chunk size of 100 due to HTTP url limitations.
5. You can now send parallel requests just to retrieve a chunk of ids (no need to pass filter again).  
Note that you can request a list of ids in each call.
We recommend doing 10 parallel requests.  Too few will not give you a lot of benefit.  Too many will slow down your system and result in timeouts.


### Recommended Pattern for AuditEvent
There are, of course, a lot of events in the system.  As a result, you can use an even more optimized access pattern:
1. Define the date range you're interested in e.g., you want events that were created or updated between 1/20/2022 and 1/30/2022.
2. Iterate over this range, so you pull ids for records one day at a time.  When you get the first page of data use the last id received and pass that as `id:above` parameter in the next call.  This will allow you to leverage the index and will be much faster.
The events are indexed on lastUpdated date so this will be faster than running a query on all the events.
3. Then follow the above pattern for common resources but include a filter to limit the events to one day at a time.

Again, the open source client SDK for Python implements all these patterns, 
so it is very easy for you to request data without having to deal with performance issues yourself.

## Using $graph or GraphQL to reduce the number of requests
FHIR stores related resources separately from the source resource.  
For example, a Practitioner(https://www.hl7.org/fhir/practitioner.html) can have multiple 
PractitionerRoles(https://www.hl7.org/fhir/practitionerrole.html).  
Typically, this would result in one call for Practitioner and another one for PractitionerRole. 
A PractitionerRole is also associated with an Organization and one or more HealthcareServices.  
So the number of requests can easily increase.  

In cases where you are requesting a few resources this will be fine.  
However when requesting a lot of resources, you can use either the [Graph API](graph.md)
or the [GraphQL API](graphql.md) to get related resources in the same call.

## Using $merge to reduce the number of add or update requests
Similarly, if you are adding or updating a lot of resources, typically you would have to make an add or update call for each resource.

Instead, you can use the [Merge API](merge.md) to send multiple resources in one request.



