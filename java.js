//NOTES for reference: Goolge maps API key: AIzaSyBDvAwRHZIzy1VI4eUADeiPPcC76USV94Q
// Event listener for a button
//$("#button-id").on("click", function() {
$(document).ready();
console.log("I'm ready")






function initMap(coordinates) {
    var uluru = coordinates;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

navigator.geolocation.getCurrentPosition(function(position) {

    var coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    console.log(coords.lat, coords.lng);
        initMap(coords);

    var spotPick = '';
    var object = '';
    var swell = '';
    var tide = '';
    var wind = '';

    // Storing our google API URL for refence to use
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords.lat + "," + coords.lng + "&key=AIzaSyBDvAwRHZIzy1VI4eUADeiPPcC76USV94Q";

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
                    originalCounty = (results[i].address_components[0].long_name);
                    //console.log(county);
                    console.log("Ready");
                    county = originalCounty.replace(/\sCounty/gi, "");
                    county = county.replace(/\s/g, "-");
                    county = county.toLowerCase();
                    break;
                }
            }

            // Get Spitcast for County
            console.log("We know where you are: " + county);
            if (county.length) {
                var queryURL = "https://cors-anywhere.herokuapp.com/http://api.spitcast.com/api/county/spots/" + county
                $.ajax({
                    url: queryURL,
                    method: "GET",
                    dataType: 'json',
                }).done(function(response) {
                    console.log('spitcast response');
                    console.log(response);
                    console.log('spitcast response');
                    for (var key in response) {
                        var spotIDList = $(response[key].spot_id)
                        var newList = $("<li><a>" + response[key].spot_name + "</a></li>")
                            .data('spotid', response[key].spot_id)
                            .on('click', function(e) {
                                $("carlosSwellClass").empty();
                                $("carlosTideClass").empty();
                                $("carlosWindClass").empty();
                                 hours = 0 + "";
                                var currentTime = new Date(),
                                hours = currentTime.getHours();
                                console.log(hours);
                                spotPick = $(this).find('a').text();
                                spotid = $(this).data("spotid")
                                console.log("this is spot pick: " + spotPick);
                                $(".carlosSpotPickClass").html("You picked: " + spotPick);
                                if (spotPick == "Blacks Beach") {
                                $(".wetsuits").empty().html('<img src="./assets/Blacks.jpg" height="300px"/>');
                                $(".carlosClothingclass").empty().html("Clothing optional!");
                                }
                              



                                var queryURL3 = "https://cors-anywhere.herokuapp.com/http://api.spitcast.com/api/spot/forecast/" + spotid
                                $.ajax({
                                    url: queryURL3,
                                    method: "GET",
                                    dataType: 'json',
                                }).done(function(response) {
                                    console.log('spitcast spot conditions response');
                                    console.log(response);
                                    if (hours > 12) {
                                        hours = (hours - 12 + "PM");
                                    } else if (hours === 12) {
                                        hours = (hours + "PM");
                                    } else {
                                        hours = (hours + "AM");
                                    }
                                    console.log("this is hours:  " + hours);
                                    for (var key in response) {
                                        if (response[key].hour === hours) {
                                            console.log(response[key])
                                            var object = response[key]
                                            swell = response[key].shape_detail.swell;
                                            tide = response[key].shape_detail.tide;
                                            wind = response[key].shape_detail.wind;
                                            console.log(response[key].shape_detail.swell);
                                            console.log(response[key].shape_detail.tide);
                                            console.log(response[key].shape_detail.wind);
                                            $(".carlosSwellClass").html("The swell is: " + swell);
                                            $(".carlosTideClass").html("The tide is: " + tide);
                                            $(".carlosWindClass").html("The wind is: " + wind);


                                        }
                                    }
                                });


                            });
                        newList.appendTo("#listlistlist");

                    }

                    var queryURL2 = "https://cors-anywhere.herokuapp.com/http://api.spitcast.com/api/county/water-temperature/" + county
                    $.ajax({
                        url: queryURL2,
                        method: "GET",
                        dataType: 'json',
                    }).done(function(response) {
                        console.log('spitcast temperature response');
                        console.log(response);
                        var temperature = (response.fahrenheit);
                        $(".carlosTempClass").html("Where the water is " + temperature + " &deg;F");
                        var clothing = (response.wetsuit);
                        $(".carlosClothingclass").html("You should wear " + clothing);
                        $(".carlosCountyClass").html("You are in: " + originalCounty);
                    if (clothing == "1mm Wetsuit"){
                     $(".wetsuits").html('<img src="./assets/1MM.jpg" height="300px"/>');
                    }
                    else if (clothing == "2mm Wetsuit"){
                         $(".wetsuits").html('<img src="./assets/2MM.jpg" height="300px"/>');
                    }
                    else if (clothing == "3mm Wetsuit"){
                         $(".wetsuits").html('<img src="./assets/3MM.jpg" height="300px"/>');
                    }
                    else if (clothing == "4mm Wetsuit"){
                        $(".wetsuits").html('<img src="./assets/4MM.jpg" height="300px"/>');
                    }
                    else {
                       $(".wetsuits").html('<img src="./assets/BoardShorts.jpg" height="300px"/>');
                    }

                    });
                });
            } else {
                console.log("Bad or Missing County");
            }
        });
});