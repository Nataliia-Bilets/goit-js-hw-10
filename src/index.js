import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
    evt.preventDefault();

    const name = evt.target.value.toLowerCase().trim();

    if (name) {
        fetchCountries(name).then(data => {
            console.log(data);
            if (data.length === 1) {
                countryInfo.innerHTML = renderSingleCardMarkup(data[0]);
            } else if (data.length > 1 && data.length <= 10) {
                countryList.innerHTML = renderCountryListMarkup(data);
            } else {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            }
        })
            .catch(err => {
                Notiflix.Notify.failure("Oops, there is no country with that name");
                clearMarkup();
            });
    } else {
        clearMarkup();
    };
};


function renderCountryListMarkup(data) {
    clearMarkup();
    return data
        .map(({ flags: { svg }, name: {official} }) =>
        `<li class="country-list__item">
  <img src="${svg}" alt="Flag of ${official}" width="100" height="60">
  <h2 class="country-list__name">${official}</h2>
</li>`)
        .join('');
};

function renderSingleCardMarkup({ name: {official}, capital, population, flags: {svg}, languages }) {
    clearMarkup();
    return `<div class="country-info__list">
  <img src="${svg}" alt="Flag of ${official}" width="100" height="60">
  <h2>${official}</h2>
</div>
<p><b>Capital:</b> ${capital}</p>
<p><b>Population:</b> ${population}</p>
<p><b>Languages:</b> ${Object.values(languages)}</p>`;
};

function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}
