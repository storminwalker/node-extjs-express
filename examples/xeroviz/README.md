XeroViz
=======

IP location tracking & visualization server


Description
---------------

XeroViz serves a 1x1 tracking gif to anyone surfing to your website. Then, as part of the web request, it will determine the location of the user based on the user's IP address and broadcasts that location to anyone listening over a socket.

This was built specifically for WDCNZ 2011 (WebDevCon in Wellington, NZ) as part of a demo of Node and socket.io. 


Requirements
-------------------

 * node.js v0.4.x
 * geoip v0.4.x

Installation
------------

    git clone git://github.com/storminwalker/XeroViz.git
    cd XeroViz

    # Use npm to install the dependencies
    npm install
    
    # if that doesn't work try
    npm update 
    
Requires [geoip](https://github.com/kuno/GeoIP) - usally requires building so best to do an install of that specifically if it's not working

	npm install geoip


Running XeroViz
---------------

To start the tracking server, run the following:

    node server.js

By default it will start a test page running on port 8001. Go to http://127.0.0.1:8001 to see a map and a test button.