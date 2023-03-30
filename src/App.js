//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Game from './Components/Game';
import Textform from './Components/Textform';
import Registration from './Components/Registration';
import ForgetPassword from './Components/ForgetPassword';
import Footer from './Components/Footer';
import React from 'react';
import Login from './Components/Login';
import Cards from './Components/Cards';
import Sidebar from './Components/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LanguageTranslation from './Components/LanguageTranslation';


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

              <div className='row'>
              <Textform heading="Enter Text To Analyze"></Textform>
              </div>


            </>
          }>
          </Route>
          <Route path='/Registration' element={<Registration />}></Route>
          <Route path='/Forget' element={<ForgetPassword />}></Route>
          <Route path='/Game' element={<Game />}></Route>
          <Route path='/Footer' element={<Footer />}></Route>
        </Routes>
      </BrowserRouter>
    </div>

  );

}

export default App;
