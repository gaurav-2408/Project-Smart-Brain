import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: '4225f0f167b548498117fff6187d39b8'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  constructor()
  {
    super();
    this.state = {
      input :'',
      ImageURL :'',
      box:{},
      route:'Signin',
      isSignedIn:false, 
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
    }
  }

  componentDidMount(){
    fetch('http://localhost:3000/')
    .then(response=>response.json())
    .then(console.log)
  }

  loadUser = (data) => {
      this.setState({
        user:{
          id:data.id,
          name:data.name,
          email:data.email,
          entries:data.entries,
          joined:data.joined
      }
    })
  }

  claculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height) 
    } 
  }

  displayFaceBox = (box)=>{
    this.setState({box : box});

  }

  onInputChange = (event)=>
  {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = ()=>
  {
      // console.log('click');
      this.setState({ImageURL:this.state.input});
      app.models
    .predict(
     Clarifai.FACE_DETECT_MODEL,
      this.state.input
    )
    .then((response)=> {
          if(response)
          {
            fetch('http://localhost:3000/image', {
              method:'put',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({id:this.state.user.id})
            })
            .then(response=>response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(err=>console.log(err))
          }
          this.displayFaceBox(this.claculateFaceLocation(response));
        })
    .catch(err => console.log(err));
  }

  onRouteChange = (route)=>
  {
    if(route === 'signout')
      this.setState({isSignedIn:false})
    else if(route === 'home')
      this.setState({isSignedIn:true});
    this.setState({route:route});    
  }

  render()
  {
    
    const {isSignedIn, box, ImageURL, route } = this.state;
      
    return(
      <div className="App">
        <Particles className="particles"
                params={particlesOptions} />
        {/* List of Components */}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          route === 'home'
          ?
            <div>
              <Logo/> 
              <Rank/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> 
              <FaceRecognition box={box} ImageURL={ImageURL}/>
            </div>
          :
            (route === 'Signin'
            ?<Signin onRouteChange={this.onRouteChange}/>
            : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>)
            
          
        }
        </div>
    );
  }
}

export default App;
