/**
 * WhenIDontWork
 * A worker script that creates a new icalendar which only contains
 * the day offs from the WhenIWork shift calendar
 */

//load the ical.js library
const ICAL = require('ical.js')

//read calendar URL from environment variable
const url = URL

/* TODO: conditional routing logic to return URLs. based on query string?
switch (user) {
 case "faiz":
   return faizUrl
 default:
   return teamUrl
}
*/

addEventListener('fetch', event => {
  return event.respondWith(eventHandler())
})

async function eventHandler() {
  const data = await fetch(url)
  let response = await gatherResponse(data)
  response = new Response(response)
  response.headers.set('cache-control', 'no-store, no-cache, must-revalidate')
  response.headers.set('content-type', 'text/calendar; charset=UTF-8')
  response.headers.set('content-disposition', 'inline')
  return response
}

async function gatherResponse(data) {
  
  //reads the icalendar URL as text
  const text = await data.text()

  //parse the text as json
  const jcalData = ICAL.parse(text)

  //get the vevent from vcalendar
  const vcal = new ICAL.Component(jcalData)
  const vevent = vcal.getAllSubcomponents('vevent')

  //define new vcalendar to construct to
  const newvcal = new ICAL.Component(['vcalendar', [], []])
  newvcal.updatePropertyWithValue('prodid', '-//WhenIDontWork')
  newvcal.updatePropertyWithValue('x-wr-calname', 'When I Dont Work')
  newvcal.updatePropertyWithValue('x-wr-caldesc', 'CSUP Singapore Off-Work Schedules')
  newvcal.updatePropertyWithValue('x-wr-timezone', 'Asia/Singapore')

  //for each vevents, filter the holiday events only
  vevent.forEach(filterHolidays)
  function filterHolidays(vevent) {
    //get the summary value from the vevent
    const summary = vevent.getFirstPropertyValue('summary')
    //check if the vevent summary contain keywords that indicates "not in the office"
    if (summary.toLowerCase().includes("off") ||
        summary.toLowerCase().includes("holiday") ||
        summary.toLowerCase().includes("leave") ||
        summary.toLowerCase().includes("not available")
        )
    {
      //get event as an object from each vevents that has been filtered
      const event = new ICAL.Event(vevent)

      //construct the new vevent
      const newvevent = new ICAL.Component('vevent'),
      newevent = new ICAL.Event(newvevent)

      //reconstruct the summary text
      let newsummary = event.summary.replace("Shift as ", "")
      newsummary = newsummary.replace(" at Cloudflare - Singapore", "")
      newevent.summary = newsummary

      //reconstruct date as full-day event
      const date = {
          year: event.startDate.year,
          month: event.startDate.month,
          day: event.startDate.day,
          isDate: true
      }
      newevent.startDate = ICAL.Time.fromData(date)

      //add the new vevent as subcomponents to the new vcalendar
      newvcal.addSubcomponent(newvevent)
    }
  }

//return the new vcalendar as a string
const results = newvcal.toString()
return results
}