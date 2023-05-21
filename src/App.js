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
import Filemanager from './Components/Filemanager';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';




function App() {
 
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <>
            <div className='row' style = {{marginBottom:'90px'}}>
            <Login />
            </div>
            <Footer></Footer>
            </>
        }>
      </Route>
          <Route path='/TextEditor' element={
            <>
              <Navbar title="TextEditor" fixed="top" />

              <div className='row' style = {{marginBottom:'90px'}}>
              <Textform heading="Enter Text To Analyze"></Textform>
              </div>
              <Footer></Footer>
            </>
          }>
          </Route>
          <Route path='/Filemanager' element={
            <>
              <Navbar title="Filemanager" fixed="top" />

              <div className='row'>
              <Filemanager></Filemanager>
              </div>
              <Footer></Footer>
              
            </>
          }>
          </Route>
          <Route path='/Registration' element={<Registration />}></Route>
          <Route path='/Forget' element={<ForgetPassword />}></Route>
          <Route path='/Game' element={<Game />}></Route>
        </Routes>
      </BrowserRouter>
    </div>

  );

}

export default App;
