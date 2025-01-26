# YouTube Data Scrapper

A React-based web application that allows users to explore YouTube channel data, including channel statistics, recent videos, and video details (likes, comments, etc.). Built with **React**, **Vite**, and **Tailwind CSS**.

👉 **Live Demo**: https://yt-data-scrapper.vercel.app/

## Features

- **Channel Search**: Search for YouTube channels by Channel ID or @handle.
- **Channel Overview**: Display channel details such as subscribers, total videos, total views, and join date.
- **Recent Videos**: Show the 10 most recent videos from the channel.
- **Video Details**: Display likes, comments, and recent comments for each video.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **Error Handling**: Graceful error handling for API failures and invalid inputs.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for making API requests.
- **YouTube Data API v3**: Fetches channel and video data from YouTube.
- **React Icons**: Provides icons for a better user experience.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rahul5403/yt_data_scrapper.git
   cd yt_data_scrapper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add your YouTube Data API key:
     ```env
     VITE_YOUTUBE_API_KEY=your_api_key_here
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview the production build**:
   ```bash
   npm run preview
   ```

## Directory Structure

```
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── public/
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    └── components/
        ├── ChannelData.jsx
        └── DataViewer.jsx
```

## Usage

1. Enter a YouTube Channel ID (e.g., `UCX6OQ3DkcsbYNE6H8uQQuVA`) or @handle (e.g., `@MrBeast`) in the search bar.
2. Click the **Search** button to fetch and display channel data.
3. Explore the channel's statistics, recent videos, and video details.

## API Key

To use this application, you need a **YouTube Data API v3** key. Follow these steps to get one:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **YouTube Data API v3** for your project.
4. Generate an API key from the **Credentials** section.
5. Add the API key to your `.env` file as `VITE_YOUTUBE_API_KEY`.
