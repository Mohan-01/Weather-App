import "./App.css";
import axios from "axios";

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [data, setData] = useState(null);
  const [temp, setTemp] = useState(null);
  const [time, setTime] = useState(null);
  const [condition, setCondition] = useState(null);
  const [content, setContent] = useState(null);
  const inputRef = useRef();

  const getWeatherData = async (city) => {
    try {
      const api_key = "783b86685fa44570a08105015241601";
      // const url = `https://api.weatherstack.com/current?access_key=5e574d1902ed12888f569c2a9254c846&query=${e.target.input.value}`;
      // const url = `https://api.tomorrow.io/v4/weather/realtime?apikey=Pl2x8j9rX0zf3OUrqApatPjERmmf7zeh&location=${city}`
      // const url = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}&q=${city}`;
      const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&aqi=yes&q=${city}`;
      const apiData = (
        await axios.get(url, {
          headers: {
            accept: "application/json",
          },
        })
      ).data;
      setData(apiData);
      // console.log(apiData.current.temp_c);
      setTimeout(() => setTemp(apiData.current.temp_c), 0);
      setCondition(apiData.current.condition.text);
      // console.log({ apiData, temp, time });
      return apiData;
    } catch (e) {
      setData(null);
      setContent("⚠️ Make sure the entered city spelled correctly");
    }
    console.clear();
    setTimeout(() => console.clear(), 1500);
  };

  return (
    <div className="App">
      <Link to="/" className="logo">
        <img src="/favicon.ico" alt="logo" />
        <p>Weather App</p>
      </Link>
      <header className="App-header">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setTime(null);
            setTemp(null);
            setCondition(null);
            setContent("Fetching data...");
            try {
              await getWeatherData(inputRef.current.value);

              const timeApi = await axios.get(
                `https://api.api-ninjas.com/v1/worldtime?city=${e.target.input.value}`,
                {
                  headers: {
                    "X-Api-Key": "TLvPa00feFuff7K1j6h+hA==Ho1iVbqI0cz00X3p",
                  },
                }
              );

              const time = await new Date(
                timeApi.data.datetime
              ).toLocaleTimeString();

              setTime(time);
              setContent(null);
            } catch (e) {
              setContent("⚠️ Make sure the entered city spelled correctly");
            }
          }}
        >
          <label htmlFor="input">Enter city: </label>
          <input type="text" name="input" id="input" ref={inputRef} />
          <button type="submit">Submit</button>
        </form>
        {data ? (
          <div className="data">
            <p>
              Current Temperature is:{" "}
              <span className="highlight">
                {temp ? (
                  <>
                    {temp} °C ({condition})
                  </>
                ) : (
                  "..."
                )}
              </span>
            </p>
            <p>
              Current Time is:{" "}
              <span className="highlight">{time ? time : "..."}</span>
            </p>
          </div>
        ) : (
          content
        )}
      </header>
    </div>
  );
}

export default App;
