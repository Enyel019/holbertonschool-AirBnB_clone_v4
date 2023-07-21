const {$} = window;

$(document).ready(function () {
  const myAmenities = {};

  const checkbox = $('.amenities input[type="checkbox"]');
  checkbox.prop('checked', false);
  checkbox.change(function () {
    const dataId = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    if (this.checked) {
      myAmenities[dataId] = dataName;
    } else {
      delete myAmenities[dataId];
    }

    const output = Object.values(myAmenities).join(', ');
    $('div.amenities > h4').text(output);
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: '{}',
    success: function (data) {
      for (const place of Object.values(data)) {
        appendPlaceArticle(place);
      }
    }
  });

  // Function to make the new POST request when the button is clicked
  $('button').click(function () {
    const selectedAmenities = Object.keys(myAmenities);
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ amenities: selectedAmenities }),
      success: function (data) {
        $('article').remove(); // Remove existing articles
        for (const place of Object.values(data)) {
          appendPlaceArticle(place);
        }
      },
      error: function (error) {
        console.error('Error making places_search request:', error);
      }
    });
  });

  // Helper function to append a new place article
  function appendPlaceArticle(place) {
    $('section.places').append(`<article>
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">$${place.price_by_night}</div>
      </div>
      <div class="information">
        <div class="max_guest">
          <i class="fa fa-users fa-3x" aria-hidden="true"></i>
          <br>
          ${place.max_guest} Guests
        </div>
        <div class="number_rooms">
          <I class="fa fa-bed fa-3x" aria-hidden="true"></i>
          <br>
          ${place.number_rooms} Bedrooms
        </div>
        <div class="number_bathrooms">
          <I class="fa fa-bath fa-3x" aria-hidden="true"></i>
          <br>
          ${place.number_bathrooms} Bathrooms
        </div>
      </div>
      <div class="description">
        ${place.description}
      </div>
    </article>`);
  }
});
