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
- [Image Creation] Hopefully if all works out one of the next features will be to add Dali API so it can create images out of nothing.
- [More random behavior] Now the bot replies with voice when you ask to it with voice, in the future a pre call to chatgpt will happen and the bot itself will decide if it wants to send you a audio voice or just text, when you send an audio voice to the bot the same will happen.


# Examples

<img width="958" alt="Screenshot 2023-05-28 at 02 52 04" src="https://github.com/DannyAndres/ChatGPT-whatsapp-bot/assets/19177489/c40cda7b-1105-4e72-a82d-9566768e5835">
<img width="964" alt="Screenshot 2023-05-28 at 02 51 49" src="https://github.com/DannyAndres/ChatGPT-whatsapp-bot/assets/19177489/89afb479-a542-4f78-bc4f-bda40f5903cd">
<img width="962" alt="Screenshot 2023-05-28 at 02 51 25" src="https://github.com/DannyAndres/ChatGPT-whatsapp-bot/assets/19177489/2fdf40c3-bab0-44e1-b417-e3439cbd3317">
<img width="948" alt="Screenshot 2023-05-28 at 02 51 03" src="https://github.com/DannyAndres/ChatGPT-whatsapp-bot/assets/19177489/8630d8b6-26e3-4999-b170-aa039938415e">
<img width="969" alt="Screenshot 2023-05-28 at 02 50 46" src="https://github.com/DannyAndres/ChatGPT-whatsapp-bot/assets/19177489/c714b1a4-42cc-44f1-9f27-e6f30e678232">
<img width="964" alt="Screenshot 2023-05-28 at 02 50 09" src="https://github.com/DannyAndres/ChatGPT-whatsapp-bot/assets/19177489/2ae89c86-6327-4914-9d8e-02c9903c621c">
<img width="966" alt="Screenshot 2023-05-28 at 02 50 29" src="https://github.com/DannyAndres/ChatGPT-whatsapp-bot/assets/19177489/69e6c381-b8e8-4421-a8ab-fed84cb2f826">

