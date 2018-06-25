import React, { Component } from 'react';
import ReactDOM from 'react-dom';



var locations = [
    { title: 'Katedra Wawelska', location: { lat: 50.054332782787824, lng: 19.9352044712264 }, type: "parks", id: '4c9b6e4ab8e9224b2b47563d' },
    { title: 'Kościół św. Barbary', location: { lat: 50.061451348141595, lng: 19.939542236386313 }, type: "restaurants", id:'5013d76ee4b0c79e480114f3' },
    { title: 'Kościół św Krzyża', location: { lat: 50.06336527146654, lng: 19.9431574344635 }, type: "restaurants", id:"4f75d7a8e4b02ca6e4ad75b8" },
    { title: 'Kościół św Wojciecha', location: { lat: 50.0608642475812, lng: 19.937513704864894 }, type: "churches", id:"4d8f276d788c5481f1c848fd" },
    { title: 'Kościół św Andrzeja', location: { lat: 50.058249397396914, lng: 19.93808568189959 }, type: "others", id:"514a07ece4b095e3f099c00a" },
    { title: 'Kościół Matki Boskej Snieżnej', location: { lat: 50.06131946813931, lng: 19.943152340036985 }, type: "sport", id:"4f53385fe4b028a920363a6b" },
    { title: 'Kościół św Anny', location: { lat: 50.06218502782165, lng: 19.933408530075234 }, type: "others", id:"4f00b3e461af974bcece01e6" },
    { title: 'Kościół św Marcina', location: { lat: 50.055224953124586, lng: 19.93840928171233 }, type: "others", id:"505ece6be4b0f0e1a23bb591" },
    { title: 'Klasztor Bernardynów', location: { lat: 50.05368292107886, lng: 19.938828560540607 }, type: "churches", id:"4fb772fae4b08bf86358e82f" },
    { title: 'Kościół sw Katarzyny', location: { lat: 50.049485416339685, lng: 19.940990209579468 }, type: "churches", id:"4eec9cb9f9ab8c5a00a379b1" },
    { title: 'Kościół św. Jana Chrzciciela i św. Jana Ewangelisty', location: { lat: 50.06306121750307, lng: 19.938544467097152 }, type: "others", id:"51333504e4b018c1c38b6ec3" }
];

var allPlaces = [];
var marker;
var filteredPlaces;
var markers;
var itemClass;
var simulateClick;
var items =[];

var foursquare = require('react-foursquare')({
    clientID: 'RUI3XYOEITXEI0Q00JHA2EFJHNWWUR0HFITWYMWDLSCYKC00',
    clientSecret: 'LBKHEB0BGBIC0RNSJLEAENSEUGZDESLED2IHHOHQUZNWDDRA'
});


// foursquare venues params
var params = {
    "near": "Kraków",
    "ll": "50.054332782787824,19.9352044712264 ",
    "radius": 2000,
    "query": "kościół, katedra",
    "limit": 30,
};

// create list of markers
function createList() {
    for (var i = 0; i < locations.length; i++) {
        var listItem = locations[i].title;
        allPlaces.push(listItem);
        filteredPlaces = allPlaces;
        
    }
}

createList();


export default class MapContainer extends Component {

    // ======================
    // ADD LOCATIONS TO STATE
    // ======================
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.filteredPlaces = this.filteredPlaces.bind(this);
        this.showMenu=this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);


        this.state = {
            filteredPlaces: allPlaces,
            items: [], // forsquare array
            locations: locations

        };


    }
    showMenu(){
        document.getElementsByClassName("sidebar")[0].style.width = "300px";
    
    }

    hideMenu(){
        document.getElementsByClassName("sidebar")[0].style.width = "0px";
    }
    // click on list view to simulate click on marker and open infowindow
    handleClick(e) {
        e.preventDefault();
        itemClass = e.target.getAttribute('Class');
        simulateClick();
      

    }

    
    componentDidMount() {
        
        foursquare.venues.getVenues(params)
            .then(res => {
                this.setState({ items: res.response.venues });
            });

        this.loadMap(); 
    }


   
    componentDidUpdate() {
        this.loadMap(); // call loadMap function to load the google map

    
    }


    filteredPlaces(e) {
        const text = e.currentTarget.value;
        filteredPlaces = this.getFilteredPlacesForText(text);

        this.setState({
            filteredPlaces
        });
    }

    // check if li item inclue at least one letter from location name(locations array)
    getFilteredPlacesForText(text) {
        return allPlaces.filter(place => place.toLowerCase().includes(text.toLowerCase()));

    }
  


    loadMap() {
    
        if (this.props && this.props.google) { // checks to make sure that props have been passed
            const { google } = this.props; // sets props equal to google
            const maps = google.maps; // sets maps to google maps props

            const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
            const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

            const mapConfig = Object.assign({}, {
                center: { lat: 50.058249397396914, lng: 19.93808568189959  }, // sets center of google map to NYC.
                zoom: 15, // sets zoom. Lower numbers are zoomed further out.
                mapTypeId: 'terrain' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
            });


            var map;
            markers = [];
        

            this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
            var infowindow = new google.maps.InfoWindow();
    
            // ==================
            // ADD MARKERS TO MAP
            // ==================
            this.state.locations.forEach(location => { // iterate through locations saved in state
                marker = new google.maps.Marker({ // creates a new Google maps Marker object.
                    position: { lat: location.location.lat, lng: location.location.lng }, 
                    map: this.map, 
                    title: location.title,
                    id: location.id

                });

               
           
                //open infowindow on click
                marker.addListener('click', function () {
                    populateInfoWindow(this, infowindow);
                    // panorama(this, infowindow)
                    });

               
                 
                markers.push(marker);
              
                 
               
            });

            // end of looping markers
        

            // loop through view list to find coresponding markers
            var checkMarker = function () {
                filteredPlaces.forEach(place => {
                    markers.forEach(marker => {

                        // show marker if its li elements includes at least one letter from marker title
                        if (filteredPlaces.includes(marker.title)) {
                            marker.setVisible(true);

                        }
                        else {
                            // hide the rest of markers
                            marker.setVisible(false);
                        }
                        
                    });


                });

            };
            checkMarker();

            
            
                    
           
            
            // add items to forsquare array
            this.state.locations.forEach(place => {
                this.state.items.forEach(item => {
                    if (item.id === place.id) {
                        items.push(item)
                        
                    }
                })

            })

            

            // var panorama = function (marker, infowindow) {
            //         var pano = null;

            //     google.maps.event.addListener(infowindow, 'domready', function () {
            //         if (pano != null) {
            //             pano.unbind("position");
            //             pano.setVisible(false);
            //         }
            //         pano = new google.maps.StreetViewPanorama(document.getElementById("content"), {
            //             navigationControl: true,
            //             navigationControlOptions: { style: google.maps.NavigationControlStyle.ANDROID },
            //             enableCloseButton: false,
            //             addressControl: false,
            //             linksControl: false
            //         });

            //         pano.bindTo("position", marker);
            //         pano.setVisible(true);


            //     });
            // }
             
            // function  populateinfowindow found on https://stackoverflow.com/q/39626347
            
            var populateInfoWindow = function (marker, infowindow) {
                var content = "";
                
            



              // add foursqure info if marker id = forquare venue id
                items.forEach(item => {
                    if (marker.id === item.id) {

                        content = '<div><div id = "content"></div> <p>' + item.categories[0].name + '</p> adres: '+item.location.formattedAddress+ '</div>';
                    }
                    return content;
                });
                
                if (infowindow.marker !== marker) {

                    infowindow.marker = marker;
                    
                    infowindow.setContent('<div> '+ marker.title + content +'</div>');
                    infowindow.open(map, marker);
                   
                    // Make sure the marker property is cleared if the infowindow is closed.
                    infowindow.addListener('closeclick', function () {

                        infowindow.setMarker = null;
                        marker.setAnimation(null);
    
                    });
                }

            };

            
        
           

            // simulate marker click when list item i clicked
            simulateClick = function () {
                for (var i = 0; i < markers.length; i++) {
                    // simulate click if marker title = li class show info window and start animation
                    if (markers[i].title === itemClass) {

                        new google.maps.event.trigger(markers[i], 'click');
                        // console.log(markers[i].title);
                        // console.log(i);
                        if (markers[i].getAnimation() != null) {
                            markers[i].setAnimation(null);
                        } else {
                            markers[i].setAnimation(google.maps.Animation.BOUNCE);
                        }
                        
                        
                    }else{
                        markers[i].setAnimation(null);
                    }
                }
            };
            

        }

    }

    render() {
        const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
            width: '100vw', // 90vw basically means take up 90% of the width screen. px also works.
            height: '100vh', // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
        };

        return (

            // in our return function you must return a div with ref='map' and style.
            <div className="container">
                <div className="hamburger" onClick={this.showMenu}>&#9776;</div>
                <div className="sidebar">

                    <input className="search" onInput={this.filteredPlaces} />
                    <button onClick={this.hideMenu}>X</button>
                    <ul>

                        {this.state.filteredPlaces.map(place => <li key={place} id={place} className={place} onClick={this.handleClick}> {place}</li>)}
                    </ul>

                </div>
                
                <div ref="map" style={style}>
                    loading map...
      </div>
            </div>
        )
    }


}

