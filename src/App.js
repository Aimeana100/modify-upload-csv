import React, { useState } from 'react';
import Papa from 'papaparse';

import './App.css';

function App() {
    const [csvData, setCsvData] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
  
    Papa.parse(file, {
      complete: (result) => {
        // Add a new column 'Role' with a predefined value
        const newData = result.data.map((row, index) => {
          if (index === 0) {
            // Add header for the new column
            return [...row, 'Role'];
          } else {
            if (row[0]) {
              // Determine role based on conditions (STUDENT or LECTURE)
              const role = "STUDENT"; // or LECTURE accordingly
              return [...row, role];
            } else {
              // If the row is empty, just return the row without modifying
              return row;
            }
          }
        });
  
        setCsvData(newData);
      },
    });
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modified.csv';
    a.click();
  };

  
  const handleSubmit = async () => {
    try {
      const response = await fetch('/backend-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(csvData),
      });

      if (response.ok) {
        setUploadStatus('CSV data uploaded successfully.');
      } else {
        setUploadStatus('Failed to upload CSV data.');
      }
    } catch (error) {
      console.error('Error uploading CSV data:', error);
      setUploadStatus('An error occurred while uploading CSV data.');
    }
  };


  return (
    <div className="App">
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={handleDownload}>Download Modified CSV</button>
      <button onClick={handleSubmit}>Upload CSV Data</button>
    </div>
  );
}

export default App;
