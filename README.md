# When I Don't Work

Cloudflare Workers script that creates a new icalendar which only contains
the day offs from the WhenIWork shift calendar

## Getting Started

Edit the `index.js` file, define the URL to read the icalendar from.

### Deploy to Production

Edit the `wrangler.toml` file, add the `account_id`, `zone_id` and `route` to deploy the Workers script to.

Deploy the worker to the route:

```
wrangler publish
```

### Develop

Execute `index-node.js` with Node.js

```
node index-node.js
```
