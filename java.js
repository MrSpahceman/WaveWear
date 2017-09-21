//NOTES for reference: Goolge maps API key: AIzaSyBDvAwRHZIzy1VI4eUADeiPPcC76USV94Q
// Event listener for a button
//$("#button-id").on("click", function() {
$(document).ready();
console.log("I'm ready")

var spotPick;

var currentTime = new Date(),
      hours = currentTime.getHours();
    console.log(hours);

navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    console.log(lat, long);
    $("p").append(lat, long);

    // Storing our google API URL for refence to use
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyBDvAwRHZIzy1VI4eUADeiPPcC76USV94Q";

    // Perfoming an AJAX GET request to our queryURL
    $.ajax({
            url: queryURL,
            method: "GET"
        })

        // After the data from the AJAX request comes back
        .done(function(response) {
            var county = '';
            console.log("We have your location - muahaha")

            var results = response.results;
            //console.log(response);

            // Get County
            for (i = 0; i < results.length; i++) {
                if ((results[i].types.indexOf("administrative_area_level_2")) !== -1) {

                    console.log(results[i].types);
                    county = (results[i].address_components[0].long_name);
                    //console.log(county);
                    console.log("Ready");
                    county = county.replace(/\sCounty/gi, "");
                    county = county.replace(/\s/g, "-");
                    county = county.toLowerCase();
                    break;
                }
            }

            // Get Spitcast for County
            console.log("We know where you are: " + county);
            if (county.length) {
                var queryURL = "https://cors.io/?http://api.spitcast.com/api/county/spots/" + county
                $.ajax({
                    url: queryURL,
                    method: "GET",
                    dataType: 'json',
                }).done(function(response) {
                    console.log('spitcast response');
                    console.log(response);
                    //for (i = 0; i < response.length; i++) {
                        //var spotNames = (response[i].spot_name);
                        //console.log(spotNames);
                    console.log('spitcast response');
                            for (var key in response) {
                            var spotIDList=$(response[key].spot_id)
                            var newList=$("<li><a href='#''>"+response[key].spot_name+"</a></li>")
                            .data('spotid', response[key].spot_id)
                            .on('click', function(e) {
                            spotPick = $(this).find('a').text();
                            spotid = $(this).data("spotid")
                            console.log(spotPick);
                            
                         var queryURL3 = "https://cors.io/?http://api.spitcast.com/api/spot/forecast/" + spotid
                        $.ajax({
                            url: queryURL3,
                            method: "GET",
                            dataType: 'json',
                        }).done(function(response) {
                            console.log('spitcast spot conditions response');
                            console.log (response);
                            if (hours > 12){
                                hours = (hours -12 + "PM");
                            }
                            console.log (hours);

                            for (var key in response){
                                if(response[key].hour === hours){
                                    console.log(response[key])
                                    var object = response[key]
                                        console.log(response[key].shape_detail.swell);
                                        console.log(response[key].shape_detail.tide);
                                        console.log(response[key].shape_detail.wind);
                                }
                            }
                        });


                            });
                            newList.appendTo("#listlistlist");
                    }

                    var queryURL2 = "https://cors.io/?http://api.spitcast.com/api/county/water-temperature/" + county
                        $.ajax({
                            url: queryURL2,
                            method: "GET",
                            dataType: 'json',
                        }).done(function(response) {
                            console.log('spitcast temperature response');
                            console.log(response);
                        var temperature = (response.temperature);
                            console.log (response.fahrenheit);
                        var clothing = (response.wetsuit);
                            console.log(clothing);
                        });
                });
            } else {
                console.log("Bad or Missing County");
            }
        });
});