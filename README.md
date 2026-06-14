# wt-websocket-tracker

A patch for the Winnipeg Transit web app which improves the functionality of the new WebSocket-based live tracking system, mainly geared towards transit photographers and enthusiasts.

## Features

- Show the run code and fleet number on the bus icons on the map, instead of the route number (e.g. "1-110-1 (945)" instead of "888").
- When clicking on a bus icon, add links to [WTLive](https://www.wtlivewpg.com) for the bus's run and the bus history for the vehicle, and to On the Go for the vehicle.
- Show how late or early a bus is on its bus icon and its On the Go page, calculated as the difference between scheduled and estimated stop times.
- When using On the Go, continuously update the "Next stop" section with the bus's next stop instead of remaining static after the page loads.
- When using On the Go, add buttons for "Previous trip" and "Next trip" similar to when using the Trip Schedules page.
- Display the actual scheduled/live arrival times for past stops, instead of just displaying "Past".
- Add a live tracker of all buses in the system (or a specific list of fleet numbers) on a map, for example:
    - [https://winnipegtransit.com/routes/customtracker/details?show-vehicles=all](https://winnipegtransit.com/routes/customtracker/details?show-vehicles=all): Track all vehicles in the system, including On-Request and work buses when they are active.
        - **Caution**: Tracking all vehicles may cause significant performance issues or crash the page, especially on mobile devices.
    - [https://winnipegtransit.com/routes/customtracker/details?show-vehicles=284-299,641-664](https://winnipegtransit.com/routes/customtracker/details?show-vehicles=284-299,641-664,930-949,980): Track all Zero-Emission buses (X(H)E40s and X(H)E60s) in the system, as of May 2026.
    - [https://winnipegtransit.com/routes/customtracker/details?show-vehicles=292-299,371-398,475-497](https://winnipegtransit.com/routes/customtracker/details?show-vehicles=292-299,371-398,475-497): Track all articulated buses in the system, as of May 2026.
    - [https://winnipegtransit.com/routes/customtracker/details?show-vehicles=177,337,907,973,980,985,990,991](https://winnipegtransit.com/routes/customtracker/details?show-vehicles=177,337,907,973,980,985,990,991): Track all wrapped buses, data from [WTLive](https://www.wtlivewpg.com/Pages/Tracker/BusHist/Buses/) as of May 2026.
- Tracking buses by route is also possible by using the `show-routes` query parameter instead of `show-vehicles`, for example:
    - [https://winnipegtransit.com/routes/customtracker/details?show-routes=BLUE](https://winnipegtransit.com/routes/customtracker/details?show-routes=BLUE): Track all buses on route BLUE (this has little difference compared to the official tracking page for that route).
    - [https://winnipegtransit.com/routes/customtracker/details?show-routes=101,102,103,104,105,106,107,108,109,110,111,112](https://winnipegtransit.com/routes/customtracker/details?show-routes=101,102,103,104,105,106,107,108,109,110,111,112): Track all buses serving On-Request zones (routes 101-112).
    - [https://winnipegtransit.com/routes/customtracker/details?show-routes=FX2,D10,22,223,101](https://winnipegtransit.com/routes/customtracker/details?show-routes=FX2,D10,22,223,101)
- Show the number of buses on the map, and the number of buses with GPS data.
    - For the buses without GPS data, place them in a grid based on their fleet numbers in the southwest of the city outside the service area instead of hiding them. They still contain the same information in their icons and popups as the buses with GPS data.
    - Buses are removed from the grid and placed on the map once they receive GPS data.
- Add buttons to view a stop's schedule on the next weekday, Saturday, or Sunday, beginning at the start of service. This makes it easier to see full stop schedules without manually changing the date and time.

## Installation

### Generating the patched JavaScript file

This project only includes a patch file to avoid potential copyright issues with distributing the Winnipeg Transit app's source code. To generate the patched JavaScript file, follow these steps:

1. System requirements:
    - Unix-like operating system (e.g. Linux, macOS, WSL on Windows)
    - The most recent version of a Chromium-based web browser (only Chromium has been tested)
2. Clone this repository and navigate to the project directory:
```bash
git clone https://github.com/CyrilSLi/wt-websocket-tracker
cd wt-websocket-tracker
```
3. Open a new Chromium browser tab and navigate to [https://winnipegtransit.com](https://winnipegtransit.com).
4. Open developer tools (F12), and navigate to the "Sources" tab. Find the JavaScript file in the list of sources as shown below:
```
- Top
  - winnipegtransit.com
    - _expo/static/js/web
      - index-[alphanumeric hash].js
```
5. Open the JavaScript file, ensuring that the "Pretty print" option is enabled (the `{}` button at the bottom left of the code viewer should be active). Copy the entire contents of the file (Ctrl+A, then Ctrl+C).
6. Create a new file in the project directory (the same directory as `wtpatch`) named `index.js`, and paste the contents of the JavaScript file from the developer tools into it.