import React, { useEffect, useState, useCallback } from 'react';
import WeatherCard from './weatherCard';
import './style.css';

const Temp = () => {
  const [searchValue, setSearchValue] = useState('');
  const [tempInfo, setTempInfo] = useState('');

  const getWeatherInfo = useCallback(async () => {
    try {
      let url = '';

      if (searchValue) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=metric&appid=9805c2f74ececcfc06477bfcd4083f6e`;
      }
      if (url) {
        const res = await fetch(url);
        const data = await res.json();

        const { temp, humidity, pressure } = data.main;
        const { main: weathermood } = data.weather[0];
        const { name } = data;
        const { speed } = data.wind;
        const { country, sunset } = data.sys;

        const myNewWeatherInfo = {
          temp,
          humidity,
          pressure,
          weathermood,
          name,
          speed,
          country,
          sunset,
        };

        setTempInfo(myNewWeatherInfo);
      }
    } catch (error) {
      console.log(error);
    }
  }, [searchValue]);

  useEffect(() => {
    getWeatherInfo();
  }, [searchValue, getWeatherInfo]);

  useEffect(()=>{
    getDefaultLocation();
  },[])

  const getDefaultLocation = () => {
    // Get user's coordinates
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocoding to get location name
        const reverseGeocodeUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=9805c2f74ececcfc06477bfcd4083f6e`;
        const res = await fetch(reverseGeocodeUrl);
        const data = await res.json();
        const { name } = data;

        setSearchValue(name);
      });
    }
  }

  return (
    <>
      <div className="wrap">
        <div className="search">
          <input
            type="search"
            placeholder="Enter city name"
            autoFocus
            id="search"
            className="searchTerm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* our temp card */}
      <WeatherCard tempInfo={tempInfo} />
    </>
  );
};

export default Temp;
