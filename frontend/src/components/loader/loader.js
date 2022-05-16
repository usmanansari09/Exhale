import React from 'react';

const Loader = props => {
  const { loading } = { ...props }

  return loading ? (
    <div id="overlay">
      <div className="loader"></div>
    </div>
  ) : null;
}

export default Loader;