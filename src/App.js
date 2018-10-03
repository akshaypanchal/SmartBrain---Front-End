import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Clarifai from 'clarifai';
import FaceDetection from './components/FaceDetection/FaceDetection';


const app = new Clarifai.App({

    apiKey:'d9287633f4904e7bb6c18a11068c6cee'

});


const particleOptions =   {     particles:{       number:{         value:50,
density:{           enable:true,           value_area:800         }       }
} }

const intialState = {
        input : '',
        imageURL:'',
        box: {},
        route:'signin',
        isSignedin : false,
        user:{
          id: '',
          name: '',
          email: '',
          entries:0,
          joined:'',
        }
      }


class App extends Component {
  constructor()
  {
      super();
      this.state = intialState;

  }

  loadUser = (data) =>{

      this.setState({user: {

          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined            
      }})
    }

  calculateFaceLocation =(data) =>
  {

      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage'); 
      const width = Number(image.width);
      const height = Number(image.height);
      console.log(width, height);
      return{
             leftCol : clarifaiFace.left_col * width,
             topRow: clarifaiFace.top_row * height,
             rigthCol: width - (clarifaiFace.right_col *  width),
             bottomRow: height - (clarifaiFace.bottom_row * height)
      }
 }



 displayFaceBox = (box) =>
 {
    console.log(box);
    this.setState({box: box});

 }


 onRouteChange = (route) =>
 {
    if(route === 'signout')
    {
        this.setState(intialState);
    }
    else if(route === 'home')
    {
      this.setState({isSignedin: true});
    }

    this.setState({route: route});

 }
  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }

  onButtonSubmit =() => {
    this.setState({imageURL: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)

    .then(response => {
        if(response) {

           fetch('https://fathomless-atoll-67738.herokuapp.com/image', {
                method: 'put',
                headers :{'Content-Type' : 'application/json'},
                body: JSON.stringify({
                      id: this.state.user.id  
                 })
            })

           .then(response => response.json())
           .then(count => {
                this.setState(Object.assign(this.state.user, {entries: count}))
           })
           .catch(console.log)
        }

          this.displayFaceBox(this.calculateFaceLocation(response));
      
    })  

    .catch(err => console.log(err));
  

  }


  render() {
    return (
      <div className="App">
          <Particles  className='particles'
            params={particleOptions} 
          />
          <Navigation  isSignedin={this.state.isSignedin} onRouteChange={this.onRouteChange} /> 
          { this.state.route === 'home' 
            ? 
              <div>
                <Logo />
                <Rank name={this.state.user.name}  entries={this.state.user.entries} />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceDetection  box={this.state.box} imageURL={this.state.imageURL}/>
              </div> 
           :
            ( this.state.route === 'signin' 
              ?
                <Signin loadUser={this.loadUser} onRouteChange ={this.onRouteChange} />
              :
                <Register loadUser={this.loadUser} onRouteChange ={this.onRouteChange} />

             )
  
         }
      </div>
    );
  }
}

export default App;
