//import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Textform from './Components/Textform';
import Registration from './Components/Registration';
import ForgetPassword from './Components/ForgetPassword';
import Footer from './Components/Footer';
import React from 'react';
import Login from './Components/Login';
import About from './Components/About';
import Filemanager from './Components/Filemanager';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ResetPassword from './Components/ResetPassword';




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
            <div>
            <Footer></Footer>
            </div>
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
          <Route path='/Notesmanager' element={
            <>
              <Navbar title="Notesmanager" fixed="top" />

              <div className='row' style = {{marginBottom:'90px'}}>
              <Textform heading="Enter Text To Analyze"></Textform>
              </div>
              <Footer></Footer>
            </>
          }>
          </Route>
          <Route path='/About' element={
            <>
              <Navbar title="About" fixed="top" />
              <div className='row' style = {{marginBottom:'90px'}}>
              <About></About>
              </div>
              <Footer></Footer>
            </>
          }>
          </Route>      

          <Route path='/Registration' element={
            <>
            <Registration />
            <div>
            <Footer></Footer>
            </div>
           
            </>
        }>
          
          </Route>
          <Route path='/Forget' element={<ForgetPassword />}></Route>
          <Route path='/ResetPassword' element={<ResetPassword />}></Route>       
        </Routes>
      </BrowserRouter>
    </div>

  );

}

export default App;
