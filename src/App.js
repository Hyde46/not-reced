import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

function App() {
  const [date, setDate] = useState(null);
  useEffect(() => {
    async function getDate() {
      const res = await fetch('/api/date');
      const newDate = await res.text();
      setDate(newDate);
    }
    getDate();
  }, []);
  return (
    <Button variant="contained" color="primary">
    Hello World
  </Button>
  );
}

export default App;
