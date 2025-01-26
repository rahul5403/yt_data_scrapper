import { useState, useEffect } from 'react';
import axios from 'axios';

function DataViewer({ dataType }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = localStorage.getItem('yt-api-key');
      setLoading(true);
      setError(null);

      try {
        let endpoint = '';
        let params = {
          key: apiKey,
          part: 'snippet',
          maxResults: 50,
        };

        switch (dataType) {
          case 'subscriptions':
            endpoint = 'https://www.googleapis.com/youtube/v3/subscriptions';
            params.mine = true;
            break;
          case 'comments':
            endpoint = 'https://www.googleapis.com/youtube/v3/commentThreads';
            params.myRecentComments = true;
            break;
          case 'likes':
            endpoint = 'https://www.googleapis.com/youtube/v3/videos';
            params.myRating = 'like';
            break;
          default:
            throw new Error('Invalid data type');
        }

        const response = await axios.get(endpoint, { params });
        setData(response.data.items);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">
        {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <img
              src={item.snippet.thumbnails?.default?.url}
              alt=""
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h4 className="font-semibold">{item.snippet.title}</h4>
            <p className="text-sm text-gray-600">{item.snippet.description?.slice(0, 100)}...</p>
            <p className="text-xs text-gray-500 mt-2">
              Published: {new Date(item.snippet.publishedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataViewer;