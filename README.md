# How to run

run by filling the credentials in the corresponding json files inside config folder
examples are provided in JS files in the same folder

after that create an empty json inside history.json file in bot/storage folder
this file keeps the history so chatgpt have a memory, you can configure that field inside config.json in config folder. If history.json does not exists create the file.

Create the following folders if they don't exist already

bot/audio
bot/storage
bot/images
bot/videos & bot/videos/frames

# Fixes

When using video data the following package has a bug in this current version which does not allow to return the video 64 encoded data

"whatsapp-web.js": "1.20.0"

The only way to fix this is going to node_modules folder and whatsapp-web.js folder
after that in src/structures/Message.js the line 406 must be

`if (msg.mediaData.mediaStage.includes('ERROR')) {
  // media could not be downloaded
  return undefined;
}`

and not the fetching part, the browser does download the video, no need to cancel the ones that are fetching
