import "./App.css";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [data, setData] = useState(null);
  const [content, setContent] = useState(null);
  return (
    <div className="App">
    <Link to='/' className="logo">
      <img src="/favicon.ico" alt="logo" /> 
      <p>Weather App</p>
    </Link>
      <header className="App-header">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setContent('Fetching data...');
            try {

            const apiData = await axios.get(
              `http://api.weatherstack.com/current?access_key=5e574d1902ed12888f569c2a9254c846&query=${e.target.input.value}`
            );

            console.log({apiData});
            
            if(apiData?.data?.error) {
              setData(null)
              setContent('⚠️ Make sure the entered city spelling is correct');
              return;
            }

            if (!apiData.data || !apiData.data.current) setData('Retry again');
            else setData(apiData.data.current);

            const timeApi = await axios.get(`https://api.api-ninjas.com/v1/worldtime?city=${e.target.input.value}`, {
              headers: {
                "X-Api-Key": "TLvPa00feFuff7K1j6h+hA==Ho1iVbqI0cz00X3p"
              }
            })
            const time = await (new Date(timeApi.data.datetime)).toLocaleTimeString();
            
            setData(data => ({...data, time}));

            setContent(null);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <label htmlFor="input">Enter city: </label>
          <input type="text" name="input" id="input" />
          <button type="submit">Submit</button>
        </form>
        {data ? (
          <div className="data">
            <p>Current Temperature is: <span className="highlight">{data.temperature} {data.temperature !== 'Retry again' && `°C (${data.weather_descriptions.length && data.weather_descriptions[0]})`}</span></p>
            <p>Current Time is: <span className="highlight">{data.time}</span></p>
          </div>
        ) : content}
      </header>
    </div>
  );
}

export default App;
