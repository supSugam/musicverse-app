# MusicVerse 🎵🌍

MusicVerse is a cross-platform application that revolutionizes the way you experience music. With a rich set of features, it empowers you to explore, share, and collaborate on your favorite tunes like never before. 🎶✨

## Features

- 🎧 Listening to music
- ⬆️ Uploading tracks, albums, and playlists
- 🔗 Sharing your favorite music with friends
- 📥 Offline listening and downloads
- 🎛️ Feature-rich music player
- 🕵️‍♂️ Follow other users and artists
- 👥 Collaborative playlist creation
- 💻 Background playback
- 🔮 Personalized song recommendations based on your listening history
- ❤️ Like/Unlike tracks and save/unsave playlists
- 📰 Personalized feed content
- 🔔 Push notifications and in-app notifications
- 🔗 Shareable links for easy sharing

## Tech Stack

- 📱 React Native (Expo) with TypeScript for cross-platform mobile development
- 🕸️ NestJS for the backend
- 💾 PostgreSQL database with Prisma ORM
- 🧠 Python-based recommendation system
- 🌐 NextJS for the admin dashboard
- 🔄 Agile Incremental model for project methodology
- 🧪 Manual testing and unit testing with Jest

## Instructions to Run Locally

### Requirements

- Node.js
- NPM
- Python
- eas-cli (for building the app)
- Zrok (recommended for port forwarding)
- Either an SDK manager or a mobile device with Expo installed and connected to the same internet (assuming no firewall blockages)
- PostgreSQL database created based on the following URL:

DATABASE_URL="postgresql://musicverse:musicverse@localhost:5432/musicverse_db?schema=public"

(or edit this in the `.env` file of `musicverse-backend`)

### Setup

1. Navigate to `musicverse-app` and run `npm install`
2. Navigate to `musicverse-backend` and run `npm install`
3. Navigate to `musicverse-dashboard` and run `npm install`
4. Navigate to `musicverse-recommendation-system`, activate the virtual environment, and run `pip install -r requirements.txt`
5. Run `npx prisma migrate` to create tables according to the schema

### Running the Project

You have two options for running the project:

**Option 1: Change Port Numbers**

1. Change the port numbers for each project and update the `BASE_URL` in the `.env` file, `package.json`, and `eas.json` accordingly.

**Option 2: (Recommended) Use Zrok**

1. Install Zrok from [https://docs.zrok.io/docs/getting-started](https://docs.zrok.io/docs/getting-started)
2. Invite yourself to Zrok by running the `zrok invite` command
3. Check your email, click the invite link, and enter a password for your account
4. Log in to Zrok and retrieve your token
5. Back in your terminal, run `zrok enable [your_token]`
6. Run the following command:

zrok reserve public http://localhost:{musicverse_backend_port}--backend-mode proxy

This will generate a reserved token, which you can use to forward the `musicverse-backend` localhost port, making it publicly accessible and bypassing any firewall limitations.

7. Update the `package.json` of `musicverse-backend` with your new Zrok reserved token:

```json
"start:dev": "nest start --watch --port 5984",
"start:zrok": "zrok share reserved {zrok_reserved_token}",
"start:both": "concurrently \"npm:start:dev\" \"npm:start:zrok\""
```

Replace "{zrok_reserved_token}" with your own token and execute npm run start:both.

Update the package.json of musicverse-dashboard and musicverse-app, eas.json of musicverse-app, and recommender.py of musicverse-recommendation-system with your new Zrok reserved token.
Navigate to musicverse-dashboard and run npm run dev.

The default admin credentials are (automatically seeded):
Email: admin@musicverse.com
Password: Admin@2024
Username: admin

Run python recommender/app.py to start the Flask app for the recommendation system.
Run npm run dev in musicverse-app to run the React Native app in development mode.
Open the SDK emulator or your phone, launch Expo, and run the app.

©️ Copyright Sugam Subedi [https://www.github.com/supSugam](https://www.github.com/supSugam)

```

```
