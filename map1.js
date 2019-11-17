mapboxgl.accessToken = 'pk.eyJ1IjoieGM1dGMiLCJhIjoiY2p2MWJnOXk3MDBoNDRldWxydDNnb3A3biJ9.d-lZSD7x1gJEXWHubXMSiA';
var map = new mapboxgl.Map({
	container: 'map',
	center: [-0.630182, 5.345082],
	zoom:14.20,
	pitch:60,
	bearing:-13.65,
	style: 'mapbox://styles/xc5tc/ck322d1o00fch1cpi2ymzp6ny'
});

// A modal window is an element that sits on top of an application's main window. It can be opened and closed without reloading the page

    $("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
        $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
        $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
    });

    $(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
        $("#screen").fadeToggle();
        $(".modal").fadeToggle();
    });


    // 3. Creating a legend
// See example tutorial at https://docs.mapbox.com/help/tutorials/choropleth-studio-gl-pt-2/#create-arrays-of-intervals-and-colors

    var layers = [ // an array of the possible values you want to show in your legend
        'school', // Civic Spaces.png
        'hospital', // Community Park.png
        'church',
        'documented story',
        'forthcoming story'// Neighborhood Park.png
        
    ];

    var colors = [ // an array of the color values for each legend item
        '#ff8e6b',
        '#fead81',
        '#ff5724',
        '#d60b52',
        '#000000'
    ];

    // for loop to create individual legend items
    for (i=0; i<layers.length; i++) {
        var layer =layers[i]; // name of the current legend item, from the layers array
        var color =colors[i]; // color value of the current legend item, from the colors array 
        
        var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added

        var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
        var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
        legendKey.css("background", color); // change the background color of the legend key
    }



// --------------------------------------------------------
// 4. Info window 
// See example tutorial at https://docs.mapbox.com/help/tutorials/choropleth-studio-gl-pt-2/#add-the-information-window

    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var census = map.queryRenderedFeatures(e.point, {    
            layers: ['census_density 2d']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (census.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#info-window-body').html('<p>DENSITY:' + census[0].properties.density + ' per acre</p><p>TOTAL:' + census[0].properties.TOTAL + '</p><p>FEMALE:' + census[0].properties.FEMALE + '</p><p>MALE:' + census[0].properties.MALE + '</P>' );

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#info-window-body').html('<p>Hover over the map to learn more about the communities in Winneba.');
            
        }

    });


    // --------------------------------------------------------
// story-window


    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var people = map.queryRenderedFeatures(e.point, {    
            layers: ['people_icon']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (people.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#story-window-body').html('<h3>' +people[0].properties.name + '</h3><img src="' + people[0].properties.name + '.png" height="120px"><p>' + people[0].properties.name + ' lives in ' + people[0].properties.site + '.</p><p>' + people[0].properties.story + '</p><p>-Living condintion in ' + people[0].properties.site + ':</p><img src="' + people[0].properties.site + '.png" height="120px">');

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#story-window-body').html('<h3>Listen</h3><p>Hover over red hearts to hear indivudual stories.</p>');
            
        }

    });


// 6. Show/hide layers
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['census_density', 'population density'],      
         ['census_density 2d','census block'],                // layers[0]
                                      // layers[1][1] = 'Parks'
        ['facility dot', 'facility'],     
        ['facility heat', 'facility heatmap']
       
        // add additional live data layers here as needed
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });