import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaVideo, FaEye, FaCalendar, FaThumbsUp, FaComment } from 'react-icons/fa';

function ChannelData({ channelId }) {
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoDetails, setVideoDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!API_KEY) {
        setError('YouTube API key is not configured');
        setLoading(false);
        return;
      }

      try {
        // Fetch channel data
        const channelResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels`,
          {
            params: {
              part: 'snippet,statistics,contentDetails',
              id: channelId,
              key: API_KEY,
            },
          }
        );

        if (channelResponse.data.items.length === 0) {
          throw new Error('Channel not found');
        }

        setChannelData(channelResponse.data.items[0]);

        // Fetch recent videos
        const videosResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: 'snippet',
              channelId: channelId,
              order: 'date',
              type: 'video',
              maxResults: 10,
              key: API_KEY,
            },
          }
        );

        const videoItems = videosResponse.data.items;
        setVideos(videoItems);

        // Fetch video details (likes) and comments for each video
        const videoIds = videoItems.map(video => video.id.videoId);
        
        // Get video statistics (including likes)
        const videoStatsResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            params: {
              part: 'statistics',
              id: videoIds.join(','),
              key: API_KEY,
            },
          }
        );

        // Get comments for each video
        const commentsPromises = videoIds.map(videoId =>
          axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
            params: {
              part: 'snippet',
              videoId: videoId,
              maxResults: 5,
              key: API_KEY,
            },
          }).catch(error => {
            console.warn(`Comments disabled or error for video ${videoId}`);
            return { data: { items: [] } };
          })
        );

        const commentsResponses = await Promise.all(commentsPromises);

        // Combine video stats and comments
        const details = {};
        videoStatsResponse.data.items.forEach((item, index) => {
          details[item.id] = {
            statistics: item.statistics,
            comments: commentsResponses[index].data.items || [],
          };
        });

        setVideoDetails(details);
      } catch (err) {
        setError(
          err.response?.data?.error?.message || 
          err.message || 
          'An error occurred while fetching data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId, API_KEY]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-6 text-lg text-gray-600">Loading channel data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!channelData) return null;

  const { snippet, statistics } = channelData;

  return (
    <div className="space-y-8">
      {/* Channel Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <img
            src={snippet.thumbnails.medium.url}
            alt={snippet.title}
            className="w-40 h-40 rounded-2xl shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">{snippet.title}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{snippet.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-indigo-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <FaUser className="text-xl" />
                  <span className="font-semibold">Subscribers</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.subscriberCount}</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <FaVideo className="text-xl" />
                  <span className="font-semibold">Videos</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.videoCount}</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <FaEye className="text-xl" />
                  <span className="font-semibold">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.viewCount}</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <FaCalendar className="text-xl" />
                  <span className="font-semibold">Joined</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(snippet.publishedAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Recent Videos</h3>
        <div className="space-y-8">
          {videos.map((video) => {
            const videoId = video.id.videoId;
            const details = videoDetails[videoId] || { statistics: {}, comments: [] };
            
            return (
              <div key={videoId} className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="w-full rounded-xl shadow-md"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h4 className="text-xl font-bold mb-3 text-gray-900">{video.snippet.title}</h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {video.snippet.description}
                    </p>
                    <div className="flex gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <FaThumbsUp className="text-indigo-600" />
                        <span className="text-gray-700">{details.statistics.likeCount || '0'} likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaComment className="text-indigo-600" />
                        <span className="text-gray-700">{details.statistics.commentCount || '0'} comments</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Published: {new Date(video.snippet.publishedAt).toLocaleDateString()}
                    </p>
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                    >
                      Watch Video
                    </a>
                  </div>
                </div>

                {/* Comments Section */}
                {details.comments.length > 0 && (
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h5 className="font-bold text-lg mb-4 text-gray-900">Recent Comments</h5>
                    <div className="space-y-4">
                      {details.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-start gap-4">
                            <img
                              src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
                              alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
                              className="w-10 h-10 rounded-full shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {comment.snippet.topLevelComment.snippet.authorDisplayName}
                              </p>
                              <p className="text-gray-600 mt-1">
                                {comment.snippet.topLevelComment.snippet.textDisplay}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(comment.snippet.topLevelComment.snippet.publishedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChannelData;