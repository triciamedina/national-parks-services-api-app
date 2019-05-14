'use strict';

const apiKey = "LZM95Cu4WrEckneyYRaxTdqdtLfewpAZIUuQeW09";

const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    if (responseJson.data.length == 0) {
        $('#results').addClass('hidden');
        $('#js-error-message').text(`No results found`);
    } else {
        $('#js-error-message').empty();
        for (let i = 0; i < responseJson.data.length; i++){
            $('#results-list').append(
                `<li><h3>${responseJson.data[i].fullName}</h3>
                <p>${responseJson.data[i].description}</p>
                <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
                </li>`
            )};
      $('#results').removeClass('hidden');
  }
};

function getNews(query, maxResults) {
    let str = query;
    let newStr = str.replace(/\s+/g, '');
    const params = {
        api_key: apiKey,
        stateCode: newStr,
        limit: maxResults,
        start: 0,
    };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchStates = $('#js-search-states').val();
    const maxResults = $('#js-max-results').val();
    $('#js-search-states').val('');
    $('#js-max-results').val('10');
    getNews(searchStates, maxResults);
  });
}

$(watchForm);