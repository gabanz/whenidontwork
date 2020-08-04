# When I Don't Work

Cloudflare Workers script that processes icalendar URL and return back the result in ics format.

## Use Case

WhenIWork.com calendar contains my daily work schedules.
I use this Worker to create a new serverless icalendar which only contains
the days when I'm not working.
I can then import the URL (or generated ics file) to my other calendar,
so people who view the calendar knows I'm not working and won't send calendar invites on that day =)

## Getting Started

Edit the `index.js` file, define the URL to read the icalendar from.

### Deploy to Production

Edit the `wrangler.toml` file, add the `account_id`, `zone_id` and `route` to deploy the Workers script to, and the source calendar `URL` as the environment variable.

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
