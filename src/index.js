import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const searchBoxEl = document.querySelector('#search-box');

searchBoxEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const value = searchBoxEl.value.trim();
  console.log(value);

  if (!value) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      checkCountry(data);
    })
    .catch(err => {
      countryListEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

function markupList(countries) {
  const countryList = countries
    .map(({ name: { official, common }, flags: { svg } }) => {
      return `
        <li">
            <img src="${svg}" alt="Flag of ${common}" width = 45px height = 45px>
            <h2>${official}</h2>
        </li>
        `;
    })
    .join('');
  return countryList;
}

function markupInfo(countries) {
  const countryInfoEl = countries
    .map(({ flags: { svg }, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return `
                <ul>
                <li><img src="${svg}" alt="${name}" width="400" height="auto"></li>
                <li>Capital: ${capital}</li>
                <li>Population: ${population}</li>
                <li>Languages: ${languages}</li>
            </ul>
            `;
    })
    .join('');
  return countryInfoEl;
}

function checkCountry(count) {
  console.log(count);
  if (count.length === 1) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = markupInfo(count);
  }
  if (count.length >= 2 && count.length <= 10) {
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = markupList(count);
  }
}
