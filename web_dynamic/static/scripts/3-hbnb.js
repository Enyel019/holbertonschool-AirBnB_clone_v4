const { $ } = window;
$(document).ready(function () {
  const myAmenities = {};
  let myList = [];
  const checkbox = $('.amenities input[type="checkbox"]');
  checkbox.prop('checked', false);
  checkbox.change(function () {
    const dataId = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    if (this.checked) {
      myAmenities[dataId] = dataName;
    } else {
      // sourcery skip: only-delete-object-properties
      delete (myAmenities[dataId]);
    }
    for (const key in myAmenities) {
      myList.push(myAmenities[key]);
    }
    const output = myList.join(', ');
    $('div.amenities > h4').text(output);
    myList = [];
  });
});

$.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
  if (data.status === 'OK') {
    $('div#api_status').addClass('available');
  } else {
    $('div#api_status').removeClass('available');
  }
});

// adding ajax
$.ajax({ // Send a post request from curl version into ajax jquery
  type: 'POST',
  url: 'http://0.0.0.0:5001/api/v1/places_search',
  contentType: 'application/json; charset=utf-8',
  dataType: 'json',
  data: '{}',
  success: function (data) {
    for (const place of Object.values(data)) { // Loop into the result of the request and create an article tag representing a Place in the section.places.
      $('section.places').append(`<article>
  <div class="title_box">
    <h2>${place.name}</h2>
    <div class="price_by_night">$${place.price_by_night}</div>
  </div>
  <div class="information">
    <div class="max_guest">
      <i class="fa fa-users fa-3x" aria-hidden="true"></i>
      </br>
      ${place.max_guest} Guests
    </div>
    <div class="number_rooms">
      <I class="fa fa-bed fa-3x" aria-hidden="true"></i>
      </br>
      ${place.number_rooms} Bedrooms
    </div>
    <div class="number_bathrooms">
      <I class="fa fa-bath fa-3x" aria-hidden="true"></i>
      </br>
      ${place.number_bathrooms} Bathrooms
    </div>
  </div>
  <div class="description">
    ${place.description}
  </div>
</article>`);
    }
  }
});
