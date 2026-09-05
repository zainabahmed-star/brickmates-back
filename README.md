# BrickMates API 🧱

_The REST and real-time backend powering BrickMates — a social platform and marketplace for LEGO builders and collectors._

![alt text](<Screenshot 2026-09-02 184721.png>)

### Live API

[Deployed API Link](https://brickmates-site.netlify.app)

### Client Repository

[BrickMates Frontend](https://github.com/fatimaAhmed26/brickmates-frontend.git)

## About the API

This Express + MongoDB API powers everything the BrickMates client needs:

- **Auth** — JWT-based sign up, sign in, and route protection.
- **Users** — profiles, following, and a personal LEGO set collection.
- **Sets** — live browsing, search, and theme data pulled from the Rebrickable API.
- **Builds** — photo/video build posts with likes and threaded comments.
- **Marketplace** — listings to buy and sell sets between builders.
- **Messaging** — real-time chat between users via Socket.io.
- **Build Together** — a matchmaking queue that pairs builders on the same set, backed by live video calls through the Stream Video SDK.

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/brickmates-back.git
cd brickmates-back
npm install
```

Create a `.env` file in the project root:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
REBRICKABLE_API_KEY=your_rebrickable_api_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

Run the server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### Technologies Used

- **Node.js / Express** — REST API and routing
- **MongoDB / Mongoose** — data modeling and persistence
- **Socket.io** — real-time messaging
- **Cloudinary** — image and video uploads
- **Stream Video SDK** — live video calls for Build Together
- **Rebrickable API** — live LEGO set and theme data
- **JWT** — authentication

### Future Enhancements

- Add payment protections and expand marketplace trust features across the GCC region.


### Credits

We would like to thank our great Instructor ms.Nabila and our incredible IAs Zainab and Bidoor.

### Contributing

Feel free to fork this repository and submit pull requests to contribute to the development of BrickMates. For major changes, please open an issue first to discuss what you would like to change.
