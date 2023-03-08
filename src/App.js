//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Textform from './Components/Textform';
import Registration from './Components/Registration';
//import { cloneElement } from 'react';
//import About from './Components/About';
//import { Switch } from 'react-router-dom'
import React from 'react';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LanguageTranslation from './Components/LanguageTranslation';
//import { ToastContainer } from 'react-toastify';



function App() {
 // 
  return (
    <div>
    
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}></Route>
      <Route path='/TextEditor' element={
        <>
        <Navbar title="TextEditor" />
          <div className="container my-3">
            <Textform heading="Enter Text To Analyze"></Textform>
          </div>
          <div className="container my-3">
            <LanguageTranslation />
          </div>
          
        </>
      }>
      </Route>
      <Route path='/Registration' element={<Registration />}></Route>
    </Routes>
  </BrowserRouter>
    
    
    </div>
   
  );

}

export default App;
