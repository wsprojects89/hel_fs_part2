import React, { useState, useEffect } from "react";
import axios from "axios";

const Countries = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [newFilter, setFilter] = useState("");

  const findCountries = () => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then(promise => setData(promise.data));
  };

  useEffect(findCountries, []);

  const handleChangeFilter = event => {
    let filter = event.target.value;
    setFilter(filter);
    setCountries(
      data.filter(c => c.name.toUpperCase().includes(newFilter.toUpperCase()))
    );
  };

  return (
    <div>
      <Filter newFilter={newFilter} handleChangeFilter={handleChangeFilter} />
      <RenderResponse countries={countries} />
    </div>
  );
};

const RenderResponse = props => {
  if (props.countries.length > 10)
    return <p>Too many matches, specify another filter</p>;
  if (props.countries.length > 0 && props.countries.length <= 10)
    return <ShowCountry countries={props.countries} />;

  return <p>Please enter a filter</p>;
};

const ShowCountry = props => {
  const [country, setCountry] = useState(undefined);

  return (
    <div>
      {props.countries.map(c => (
        <div key={c.name}>
          {c.name}
          <button onClick={() => setCountry(c)}>show</button>
        </div>
      ))}
      {country ? (
        <Country country={country} />
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </div>
  );
};

const Country = props => {
  const [weather, setWeather] = useState(undefined);

  useEffect(() => {
    axios
      .get(
        "http://api.weatherstack.com/current?access_key=&query=" + //fill key
          props.country.capital
      )
      .then(response => setWeather(response.data));
  }, []);

  console.log(weather);

  return (
    <div>
      <h1>{props.country.name}</h1>
      <div>
        <p>capital:{props.country.capital}</p>
        <p>population:{props.country.population}</p>
        <h2>Languages:</h2>
        <ul>
          {props.country.languages.map(l => (
            <li key={l.name}>{l.name}</li>
          ))}
        </ul>
      </div>
      <img src={props.country.flag} alt="flag" width="300" height="300" />
      <br />
      {weather ? (
        <div>
          <h2>Weather in {props.country.capital}</h2>
          <p>Temperature:{weather.current.temperature}</p>
          <p>Wind:{weather.current.wind_dir}</p>
          {weather.current.weather_icons.map(d => (
            <img
              key={weather.current.weather_icons.indexOf(d)}
              src={d}
              alt="dir"
              width="16"
              height="16"
            />
          ))}
        </div>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </div>
  );
};

const Filter = props => {
  return (
    <div>
      filter :
      <input value={props.newFilter} onChange={props.handleChangeFilter} />
    </div>
  );
};

export default Countries;
