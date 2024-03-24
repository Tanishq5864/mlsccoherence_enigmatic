import React, { useState } from 'react';
import './styles.css'; // Make sure to import your CSS file

function ApiForm() {
  const [apiKey, setApiKey] = useState('');
  const [channelId, setChannelId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="container">
      <h2>Enter API Key and Channel ID</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="api-key">API Key:</label>
          <input
            type="text"
            id="api-key"
            name="api-key"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="channel-id">Channel ID:</label>
          <input
            type="text"
            id="channel-id"
            name="channel-id"
            placeholder="Enter your Channel ID"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ApiForm;
