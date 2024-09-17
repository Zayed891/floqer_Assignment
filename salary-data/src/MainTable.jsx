import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MainTable = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching data from the API
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/salaries') // Replace with your API endpoint
      .then((response) => {
        const processedData = processSalaryData(response.data);
        setYearlyData(processedData);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  // Process salary data to group by year and calculate total jobs and average salary
  const processSalaryData = (data) => {
    const yearMap = {};
    
    // Loop through each row of data
    data.forEach((row) => {
      const year = row.work_year;
      const salary = row.salary_in_usd;

      // Initialize year data if not already present
      if (!yearMap[year]) {
        yearMap[year] = { total_jobs: 0, total_salary: 0, job_count: 0 };
      }

      // Accumulate the total jobs and total salary
      yearMap[year].total_jobs += 1; // Each row represents 1 job
      yearMap[year].total_salary += salary;
      yearMap[year].job_count += 1;
    });

    // Calculate the average salary for each year
    const years = [2020, 2021, 2022, 2023, 2024];
    const result = years.map((year) => {
      const yearData = yearMap[year] || { total_jobs: 0, total_salary: 0, job_count: 1 };
      const avg_salary_usd = yearData.total_salary / yearData.job_count || 0;
      return {
        year,
        total_jobs: yearData.total_jobs,
        avg_salary_usd: avg_salary_usd.toFixed(2),
      };
    });

    return result;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">ML Engineer Salaries (2020-2024)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border bg-gray-100">Year</th>
              <th className="px-4 py-2 border bg-gray-100">Number of Total Jobs</th>
              <th className="px-4 py-2 border bg-gray-100">Average Salary (USD)</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map((row) => (
              <tr key={row.year} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 border">{row.year}</td>
                <td className="px-4 py-2 border">{row.total_jobs}</td>
                <td className="px-4 py-2 border">${row.avg_salary_usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainTable;

