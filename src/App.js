import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


import EdhRecSearch from './EdhRecSearch.js';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});

function App() {
  // searching state while app is looking for card name in list
  const [searching, setSearching] = useState(false);
  // state determined by result of searchCard()
  // if not found, isNotReced is true
  const [isNotReced, setIsReced] = useState(null);

  const [commanderName, setCommanderName] = useState("");

  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  function handleCommanderChange(e) {
    setCommanderName(e.target.value);
  }

  return (
    
    <ThemeProvider theme={theme}>
      <div className="App" style={{margin: "125px"}}>
        <center>

          <Typography variant="h5" component="h5">
            Hipster EDH Deck helper
          </Typography>

          <div style={{marginTop: "55px", marginBottom: "55px"}}>
            <form noValidate autoComplete="off">
              <TextField id="outlined-basic2" label="Commander" variant="outlined" style={{marginBottom: "15px"}} onChange={handleCommanderChange}/>
            </form>
            <form noValidate autoComplete="off">
              <TextField value={query} id="outlined-basic" label="Cardname" variant="outlined" onChange={handleChange} />
            </form>
          </div>
          {query && <EdhRecSearch query={query} commanderName={commanderName}/>}
        </center>
      </div>
    </ThemeProvider>
  );
}

export default App;
