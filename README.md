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

Also, ffmpeg needs to be installed in the computer that runs this code

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

# Features

- [General Knowledge] Uses chatgpt 3.5 to analyze text messages and replies exactly like chatgpt
  - Coding question
  - General knowledge
  - and more ...
- [Can speak] It will respond to audio messages with another audio voice message using elevenlabs and whisperAI
  - add the id of the voice and keys in config.json
- [Translation in an exclusive voice] When asked to translate something it can do that but if asked to translate something with your voice it will use "translate_id" inside elevenlabs
  - allows you to speak another language with your own voice pre trained in elevenlab's website
- [Image Analysis] Uses a gpt2 model with transformers to get the context of an image and it will feed that to chatgpt 3.5 to reply accordingly
  - you can add text to the image to ask something related to it or add more context
  - due to gpt2 being way older than 3.5 is as accurate it can get, probably I'll watch out for another image to text model in huggingface that uses 3.5 as soon as one comes up
  - model "vit-gpt2-image-captioning": https://huggingface.co/nlpconnect/vit-gpt2-image-captioning
- [Video Analysis] Uses the same gpt2 model to get the context of an image to understand videos
  - It does this by splitting them into a certain number of frames which transform to text and also takes the audio from the same video using whisperAI from openai, it feeds all of this to chatgpt 3.5 and uses that to get the content
  - Text can be added to the video to add more context or ask something related to the video

# Future Features [Work in progress]

- [Internet Connection] When it needs more updated information from the internet the goal is to scrap a certain amount of google links, transform that into text and pass it to chatgpt 3.5 as new information that can be later refer to, asked or anything that the model can do.
