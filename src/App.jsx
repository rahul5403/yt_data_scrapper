import { useState } from 'react';
import { FaYoutube, FaSearch } from 'react-icons/fa';
import ChannelData from './components/ChannelData';
import axios from 'axios';

function App() {
  const [channelId, setChannelId] = useState('');
  const [showData, setShowData] = useState(false);
  const [error, setError] = useState(null);

  const resolveChannelId = async (identifier) => {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            q: identifier,
            type: 'channel',
            maxResults: 1,
            key: API_KEY,
          },
        }
      );

      if (response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      return response.data.items[0].id.channelId;
    } catch (err) {
      setError(err.message || 'An error occurred while resolving the channel ID');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (channelId.trim()) {
      setError(null);
      setShowData(false);

      let resolvedChannelId = channelId;
      if (channelId.startsWith('@')) {
        resolvedChannelId = await resolveChannelId(channelId);
        if (!resolvedChannelId) return;
      }

      setChannelId(resolvedChannelId);
      setShowData(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-center">
          <FaYoutube className="text-4xl mr-3" />
          <h1 className="text-3xl font-bold tracking-tight">YouTube Data Explorer</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Enter YouTube Channel ID or @handle"
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
              />
              <p className="text-sm text-gray-500 mt-2 ml-1">
                Example: UCX6OQ3DkcsbYNE6H8uQQuVA (MrBeast's channel ID) or @MrBeast
              </p>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <FaSearch />
              Search
            </button>
          </form>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {showData && <ChannelData channelId={channelId} />}
      </main>
    </div>
  );
}

export default App;