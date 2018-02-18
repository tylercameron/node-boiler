function autocomplete(input, latInput, lngInput, storeName, storeWebsite, storePhone) {
    if (!input) return; // skip this fn from running if there is not input on the page
    const dropdown = new google.maps.places.Autocomplete(input);

    dropdown.addListener("place_changed", () => {
        const place = dropdown.getPlace();
        console.log(place);
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
        storeName.value = place.name;
        storeWebsite.value = place.website;
        storePhone.value = place.international_phone_number;
    });
    // if someone hits enter on the address field, don't submit the form
    input.on("keydown", e => {
        if (e.keyCode === 13) e.preventDefault();
    });
}

export default autocomplete;
