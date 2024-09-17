import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainTable from './MainTable';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/salaries')  // Adjust API URL as needed
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching salary data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <MainTable data={data} />
    </div>
  );
};

export default App;
