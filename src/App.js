import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    (async function () {
      const testData = await (await fetch(`/api/testing`)).text();
      console.log("testData", testData)
      setData(testData);
    })();
  });

  return <div>{data}</div>;
}

export default App;