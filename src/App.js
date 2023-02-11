//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Textform from './Components/Textform';
//import About from './Components/About';
//import { Switch } from 'react-router-dom'
import React  from 'react';



function App() {
  return (
    <>
   
    <Navbar title = "TextEditor"/>
    <div className = "container my-3">
    <Textform heading = "Enter Text To Analyze"></Textform>
    </div>

    </>
  );
  
} 

export default App;
