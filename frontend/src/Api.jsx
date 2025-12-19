import React, { useState } from 'react';
import axios from 'axios';

function Api() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/generate', { prompt });
      setResponse(res.data.result);
    } catch (err) {
      console.error(err);
      setResponse('Error occurred while generating response');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Gemini AI Prompt</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          cols="60"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <br />
        <button type="submit">Send Prompt</button>
      </form>

      {response && (
        <div style={{ marginTop: 20 }}>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default Api;
