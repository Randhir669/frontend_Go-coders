//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Textform from './Components/Textform';
//import About from './Components/About';
//import { Switch } from 'react-router-dom'
import React  from 'react';
import LanguageTranslation from './Components/LanguageTranslation';



function App() {
  return (
    <>
   
    <Navbar title = "TextEditor"/>
    <div className = "container my-3">
    <Textform heading = "Enter Text To Analyze"></Textform>
    </div>
    <div className = "container my-3">
    <LanguageTranslation/>
    </div>

    </>
  );
  
} 

export default App;
