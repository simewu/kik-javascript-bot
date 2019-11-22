# Kik Bot: @bot.js
As one of the most popular messaging apps in the world, Kik powers a wide variety of functionalities beyond just messaging. One of these functionalities is the ability to create bots ([here](https://bots.kik.com/)) that users can chat with to gain various information. The JavaScript Console bot was created with the intention to deliver and teach coding to anybody, with ease. It can also be used to automate messages, and explore the powerful depths of coding.

# Features
  - Instant and secure access to JavaScript on the go, in a sandboxed environment.
  - Share and execute your code creations with friends, and the internet.
  - Collaborate with others to create, optimize, and execute algorithms in real-time.

# Usage
- On a smart device, install Kik from the Google Play Store ([here](https://play.google.com/store/apps/details?id=kik.android)), the Apple App Store ([here](https://apps.apple.com/us/app/kik/id357218860)), or any other app store.
- Use the tag @bot.js to find the JavaScript Console bot page.
- Select "START CHATTING".
- Enter JavaScript code to get the result.
- Send stickers, gifs, videos, images, etc... and the bot will return the link to where this media is stored on the internet.

The json files are made to operate within ChatFlow ([here](https://nlu.kitt.ai/)), all Kik messages are relayed to this service, sanitized and processed within ChatFlow via Node.js, and the result is returned. Special precautions are taken to ensure no code can escape the sandboxed environment, access to Kik messaging functionality, and other exploitable features have been removed prior to processing.
