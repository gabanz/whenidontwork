# When I Don't Work

Cloudflare Workers script that creates a new icalendar which only contains
the day offs from the WhenIWork shift calendar.

## Getting Started

Edit the `index.js` file, define the URL to read the icalendar from.

### Deploy to Production

Edit the `wrangler.toml` file, add the `account_id`, `zone_id` and `route` to deploy the Workers script to.

Deploy the worker to the route:

```
wrangler publish
```

### Develop

Clone the repository and install dependencies in the `node_module` folder using npm.

```
npm i
```

Choose whether you want to read the locally saved icalendar file (e.g `./sample.ics`) or to fetch the file from the remote URL and comment/uncomment out the related code blocks.

Run `index-node.js` with Node.js

```
node index-node.js > output.ics
```
