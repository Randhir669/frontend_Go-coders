import React from 'react'
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard} from '@fortawesome/free-solid-svg-icons';


export default function Footer() {
  return (
    <>
      <footer className={styles.footer} style={{ position: "fixed"}}>
      <div className='row'>
        <div className='col-lg-10'>
          <p style={{ color: "white" }}>Copyright © 2023   <a href="https://go-coders.com" style={{ color: "white", textDecoration: "underline" }}>
          go-coders.com
        </a>  All rights reserved</p>
        </div>
        <div className='col-lg-2'>
        <div className='row'>
          <p style={{ color: "white" }}> <FontAwesomeIcon icon={faAddressCard} className="" />  gocoders4u@gmail.com</p>

        </div>

        </div>
      </div>



    </footer>
  
  
    </>

  )
}
