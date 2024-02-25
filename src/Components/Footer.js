import React from 'react'

export default function Footer() {
  return (
    <>
   
    <div class="footer">
      
      <div class="content">
        <div class="services">
          <h4>Services</h4>
          <p>File Manager</p>
          <p>Notes Manager</p>
        </div>
       
        <div class="links">
          <h4>Quick links</h4>
          <p><a href="/">Login</a></p>
          <p><a href="/registration">Signup</a></p>
          <p>About</p>
        </div>
        <div class="details">
          <h4 class="address">Address</h4>
          <p>
         Kolkata, India
          </p>
          <h4 class="mobile">Mobile</h4>
          <p>+91-8250347078</p>
          <h4 class="mail">Email</h4>
          <p>gocoders4u@gmail.com</p>
        </div>
      </div>
      <footer>
        <hr />
        Copyright © 2023 <a href="https://go-coders.com" style={{ color: "white", textDecoration: "underline" }}>go-coders.com</a> All rights reserved
      </footer>
      
    </div>
    </>

  )
}
