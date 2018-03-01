# ParkitectModRelayApi

Rest Api Based on Node/JS to download parkitect mods.
To be used in conjuction with the co-project, ParkitectModDownloader.
Best deployed with docker.

## Api
Request | Response
--- | --- 
GET /getVersion?item_id=ITEM_ID | { version: ITEM_VERSION }
GET /download?item_id=ITEM_ID | { link: LINK_TO_DOWNLOAD } 

## Build
``` docker build -t quexten/parkitectmodrelayapi . ```

``` docker run --name parkitect-api --link parkitect-downloader quexten/parkitectmodrelayapi```
