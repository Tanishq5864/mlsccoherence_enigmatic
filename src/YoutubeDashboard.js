import React from 'react';
import './App.css'; // Assuming you have a CSS file for your styles
import { useState,useEffect } from 'react';
import axios from 'axios';
import { IoMdPeople } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { MdOutlineOndemandVideo } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";

function YoutubeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigate = useNavigate();

  const [subscriberCount, setSubscriberCount] = useState(null);
  const [totalLikes, setTotalLikes] = useState(null);
  const [totalVideos, setTotalVideos] = useState(null);
  const [totalViews, setTotalViews] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userBio, setUserBio] = useState(null);
  const [recentVideo, setRecentVideo] = useState(null);
  const [mostLikedVideo, setMostLikedVideo] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [subscriberData, setSubscriberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);



  // const apiKey = 'AIzaSyA6hy0AdzT4YTdHYb5RjZHjc_aQNNxFwP8';
  const apiKey = 'AIzaSyCKCC93n-6_jOwkB16mO1aPGhax8CJfTsY';
  const channelId = 'UC4DQsgIOBKuhrcxw8B6lXFg';

  const fetchYouTubeStats = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);

      const stats = response.data.items[0].statistics;
      setSubscriberCount(stats.subscriberCount);
      // setTotalLikes(stats.likeCount);
      setTotalVideos(stats.videoCount);
      // setTotalViews(stats.viewCount);
    } catch (error) {
      console.error('Error fetching YouTube stats:', error);
    }
  };

  useEffect(() => {
    fetchYouTubeStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`);

      const snippet = response.data.items[0].snippet;
      setUserName(snippet.title);
      setUserBio(snippet.description);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchVideoInfo = async () => {   try {
    // Fetch recent videos
    const recentVideosResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${apiKey}`);
    const recentVideoId = recentVideosResponse.data.items[0].id.videoId;
    const videoId = recentVideoId ;
    fetchVideoInfos(videoId);
    setRecentVideo(recentVideoId);

    // Fetch most liked video
    const mostLikedVideosResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=1&key=${apiKey}`);
    const mostLikedVideoId = mostLikedVideosResponse.data.items[0].id.videoId;
    const lvideoId = mostLikedVideoId ;
    fetchVideoInfos(lvideoId);
    setMostLikedVideo(mostLikedVideoId);
  } catch (error) {
    console.error('Error fetching video info:', error);
  }
};

useEffect(() => {
  fetchVideoInfo();
}, []);



const fetchVideoInfos = async (videoId) => {
  
  try {
    const videoInfoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
    const videoData = videoInfoResponse.data.items[0];

    const thumbnail = videoData.snippet.thumbnails.medium.url;
    setThumbnail(thumbnail);
    const title = videoData.snippet.title;
    const viewCount = videoData.statistics.viewCount;
    const likeCount = videoData.statistics.likeCount;
    const videoLink =` https://www.youtube.com/watch?v=${videoId}`;

    setVideoInfo({ thumbnail, title, viewCount, likeCount, videoLink });
  } catch (error) {
    console.error('Error fetching video info:', error);
  }
};


useEffect(() => {
  const fetchAllVideos = async () => {
    try {
      // Fetch all videos from the YouTube API using the channel ID
      
      const response = await axios.get(
       ` https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50`
      );

      // Extract video IDs
      const videoIds = response.data.items.map(item => item.id.videoId).join(',');

      // Fetch video details including views and likes
      const videoResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics`
      );

      // Calculate total views and likes
      let views = 0;
      let likes = 0;
      videoResponse.data.items.forEach(video => {
        views += parseInt(video.statistics.viewCount);
        likes += parseInt(video.statistics.likeCount);
      });

      setTotalViews(views);
      setTotalLikes(likes);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  fetchAllVideos();
}, []);

useEffect(() => {
const fetchSubscriberCount = async () => {
  try {
   
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=statistics`
    );

    const subscriberCount = parseInt(response.data.items[0].statistics.subscriberCount);
    setSubscriberData(prevData => [...prevData, subscriberCount]);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
  }
};

fetchSubscriberCount();
}, []);

const data = {
  labels: Array.from({ length: subscriberData.length }, (_, i) => `Day ${i + 1}`),
  datasets: [
      {
      label: 'Subscriber Count',
      data: subscriberData,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      xAxisID: 'days',
    },
  ],
};

const options = {
  scales: {
    x: {
      id: 'days',
      type: 'category',
    },
  },
};





const handleClick = async () => {   
  
  navigate("/form");


};






  return (
    <div className="grid-container">
      <header className="header">
        <div className="menu-icon" onClick={openSidebar}>
          <span className="material-icons-outlined">menu</span>
        </div>
        <div className="header-left">
          <div className="info" onClick={handleClick}>Fill to get Info.</div>
          
        </div>
        <div className="header-center">YouTube Analytic</div>
      </header>

      <aside id="sidebar" className={sidebarOpen ? "open" : ""}>
        <div className="sidebar-title">
          <div className="sidebar-brand">
            <div className="logo">LOGO</div>
          </div>
          <span className="material-icons-outlined" onClick={closeSidebar}>close</span>
        </div>

        <div className="user">
          <img src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2F0fGVufDB8fDB8fHww" alt="User" />
        </div>
        <div className="username">
          <p>User</p>
        </div>
        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <a href="#">
              <div className="dashboard">Dashboard</div>
            </a>
          </li>
          <li className="sidebar-list-item">
            <a href="#">
              <div className="application">Application</div>
            </a>
          </li>
          <li className="sidebar-list-item">
            <a href="#">
              <div className="settings">Settings</div>
            </a>
          </li>
          <li className="sidebar-list-item">
            <a href="#">
              <div className="logout">Log Out</div>
            </a>
          </li>
        </ul>
      </aside>

      <div className="main-left">
        <div className="box-overview1">
          <div className="overview"></div>

          <div className="small-box">
            
            <div className="small-box-overview1">
              Subscriber <IoMdPeople /> {subscriberCount}
              <div className="overview"></div>
            </div>

            <div className="small-box-overview2">
              Video Count <MdOutlineOndemandVideo /> {totalVideos}
              <div className="overview"></div>
            </div>

            <div className="small-box-overview3">
              Views <FaEye /> {totalViews}
              <div className="overview"></div>
            </div>

            <div className="small-box-overview4">
              Overall Likes <AiFillLike /> {totalLikes}
              <div className="overview"></div>
            </div>
          </div>
        </div>

        <div className="box-overview2">

          <div className="username2">{userName} </div>
          <div className="user-about2">{userBio}</div>

        </div>
      </div>

      <div className="main-centre">
        <div className="box-overview3">
          <div className="latest-video">Latest Video</div>
          <img src={videoInfo?.thumbnail} />
          <div className="comments">Titles:{videoInfo?.title} </div>
          <div className="views">Views: {videoInfo?.viewCount} </div>
          <div className="likes">Likes: {videoInfo?.likeCount}</div>
        </div>
        <div className="box-overview4">
          <div className="new-achievement">New Achievements</div>
          <div className="achievement">
            <i className="fa-solid fa-champagne-glasses fa-bounce fa-2xl" style={{ color: '#121212' }}></i>
            <p>Congratulation on achieving {subscriberCount}</p>
          </div>
        </div>
      </div>

      <div className="main-right">
        <div className="box-overview5">
          <div className="popular-video">Popular Video</div>
          <img src={videoInfo?.thumbnail} />
          <div className="comments">Titles:{videoInfo?.title} </div>
          <div className="view">Views: {videoInfo?.viewCount}</div>
          <div className="likes">Likes: {videoInfo?.likeCount} </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubeDashboard;
