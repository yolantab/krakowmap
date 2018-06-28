import React, { Component } from 'react';
import './App.css';
// import the Google Maps API Wrapper from google-maps-react
import {GoogleApiWrapper } from 'google-maps-react';
// import child component
import MapContainer from './MapContainer';


class App extends Component {
  

  render() {
    return (
      
      
      <div id ="map">
       
         <MapContainer google={this.props.google}>
        </MapContainer>
      </div>
      
    );
  }
}
// OTHER MOST IMPORTANT: Here we are exporting the App component WITH the GoogleApiWrapper. You pass it down with an object containing your API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAIKAWJPVWuslzcSYcy59HpemVa0hmuiQM',
})(App)