const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = 5000;

app.use(cors());

// Function to read the CSV and convert it to JSON format
const getSalaries = () => {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream("./salaries.csv")
        .pipe(csv())
        .on("data", (data) => {
          console.log("Row data: ", data);  // Add this log
          results.push(data);
        })
        .on("end", () => {
          console.log("CSV parsing completed. Total rows: ", results.length); // Add this log
          resolve(results);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  };
  

// API route to fetch salary data
app.get("/api/salaries", async (req, res) => {
  try {
    const salaries = await getSalaries();
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: "Error reading CSV file", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
