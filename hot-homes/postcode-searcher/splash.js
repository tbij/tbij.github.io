// Search submit
async function onSubmit(event) {
  event.preventDefault()
  search = document.getElementById("search").value
  response = document.getElementById("postcode-response")

  // Show error for invalid postcodes
  if (!isPostcode(search)) {
    response.innerHTML = "We couldn\’t find this postcode"
    return
  }

  // Check if the postcode is in the area and update text accordingly
  // const isInArea = isPostcodeInArea(search)
  isPostcodeInArea(search).then(function (result) {
    if (result === true) {
      response.innerHTML = "Great! You live in the area we’re looking at <span style='font-size: 2em;'>&#9787;</span></br></br>What’s next?</br><a href='https://docs.google.com/forms/d/1J-yO0mbrfGjjEW8Hv7ni1neI7XLnaoB-3UGlL9yHR-w/viewform?edit_requested=true' target='_blank' style='text-decoration: none;'><span class='response emphasise'>&#9998;</span></a> <a class='response' href='https://docs.google.com/forms/d/1J-yO0mbrfGjjEW8Hv7ni1neI7XLnaoB-3UGlL9yHR-w/viewform?edit_requested=true' target='_blank' style='text-decoration-color: #8095C2;'>Fill out this questionnaire to register your interest</a>.</br><span class='response emphasise'>&#9728;</span> The project starts in mid July, so get in touch now!</br><a class='response' href='https://www.thebureauinvestigates.com/blog/2023-06-09/hot-homes' target='_blank' style='text-decoration: none;'><span class='response emphasise'>&#10154;</span></a> <a class='response' href='https://www.thebureauinvestigates.com/blog/2023-06-09/hot-homes' target='_blank' style='text-decoration-color: #8095C2;'>Read more about what taking part involves</a>."
      response.scrollIntoView({behavior: "smooth", block: "end"});
    } else {
      response.innerHTML = "Unfortunately, your home falls outside the area.</br> <a href='https://docs.google.com/document/d/1KEg2c9A3z-kThUFHD2hyOEfVqZxHGwjMdH5FvXfqZ5c' target='_blank' style='text-decoration: none;'><span class='response emphasise'>&#10154;</span></a> <a class='response' href='https://www.thebureauinvestigates.com/blog/2023-06-09/hot-homes' target='_blank' style='text-decoration-color: #8095C2;'>Still interested? Read more about the Hot Homes project</a>."
      response.scrollIntoView({behavior: "smooth", block: "end"});
    }
  })
}

// Look if the postcode is in the area
async function isPostcodeInArea(search) {
  const url = 'https://api.postcodes.io/postcodes/' + encodeURIComponent(search)
  const response = await window.fetch(url)
  const json = await response.json()

  const longitude = json && json.result && json.result.longitude
  if (!longitude) {
    throw new Error()
  }

  const latitude = json && json.result && json.result.latitude
  if (!latitude) {
    throw new Error()
  }

  const point = turf.point([longitude, latitude])

  const polygon = turf.polygon(hotHomesPolygon.coordinates)

  var match
  if (turf.booleanPointInPolygon(point, polygon)) {
    match = true
  } else {
    match = false
  }

  return match
}

// Postcode validation
const isPostcode = (value) => {
  value = value.toLowerCase().trim();
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/ig
  const matches = value.match(postcodeRegex)
  return matches && matches.length
}

const searchForm = document.getElementById("form")
searchForm.addEventListener("submit", onSubmit)

const searchIcon = document.getElementById("search-button")
searchIcon.addEventListener("click", onSubmit)
