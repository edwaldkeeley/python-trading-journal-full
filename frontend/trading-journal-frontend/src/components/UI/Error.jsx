import React from 'react';

const Error = ({ error, onRetry }) => {
  return (
    <div className="app">
      <div className="error">Error: {error}</div>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
};

export default Error;
