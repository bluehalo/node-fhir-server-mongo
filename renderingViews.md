# Adding custom rendering views

When you access the FHIR server via a browser (detected through user agent string), the FHIR server converts the JSON resources into HTML for easier viewing.

If there is a custom view template defined for that resource then it is used else we use the generic view template.

This is done by adding a middleware in Node Express that intercepts the json output by the services and rendering it via a view template:

fhir-server/app.js at 970a2a82ba32666f773c8f8ee3b0a52765773759 · icanbwell/fhir-server 

The view templates are stored here: [src/views/pages](src/views/pages)

 

To add a new view template for a resource:

Create a new view template in [src/views/pages](src/views/pages).  Name it with lower case name of the resource.

Update the list in app.js so it knows about the new view template.  (TODO: Should make this dynamic)

Create data binding to display the resource how you want to display it

 

Currently we use the EJS template rendering engine in Node Express but this can be replaced easily by changing:

[src/middleware/htmlRenderer.js](src/middleware/htmlRenderer.js)

 

To bypass the html, just append raw=1 to your url.
