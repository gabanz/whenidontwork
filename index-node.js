/**
 * WhenIDontWork
 * A node.js script that creates a new icalendar which only contains
 * the day offs from the WhenIWork shift calendar
 */

//load the libraries
'use strict';
const ICAL = require('ical.js')
const fs = require("fs")

//define which calendar to read from
//const url = "https://app.wheniwork.com/calendar/8a7310d798b4fa056cb8800bc26938ba4db78510.ics" //faiz calendar
const url = "https://app.wheniwork.com/calendar/8a7310d798b4fa056cb8800bc26938ba4db78510/global.ics" //team calendar

//comment out if reading from the local file system instead of remote URL
const fetch = require("node-fetch")

const request = async () => {

  //comment out if reading from the local file system instead of remote URL
  const response = await fetch(url)
  let text = await response.text()

  //uncomment if reading the text from local ics file
  //const text = fs.readFileSync("./sample.ics").toString('utf-8')
  
  //parse the text as json
  const jcalData = ICAL.parse(text)

  //get the vevent from vcalendar
  const vcalendar = new ICAL.Component(jcalData)
  const vevent = vcalendar.getAllSubcomponents('vevent')

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
console.log(newvcal.toString())

}

request()