import React, { useState } from 'react'
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function Textform(prop) {

    function handleToUpperCase() {

        console.log("Button clicked");
        var currentText = text;
        var newText = currentText.toUpperCase();
        setText(newText);        
    }

    function handleToLowerCase() {
        var newText = text.toLowerCase();
        setText(newText); 
        
    }

    function download() {
        const input = text;
        html2canvas(input)
          .then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF();
              pdf.addImage(imgData, 'JPEG', 0, 0);
              pdf.save("download.pdf");
          })
        
    }

    function handleToCopy() {

       var copyText = document.getElementById("mybox");
       // Select the text field
       copyText.select();
       navigator.clipboard.writeText(copyText.value);
    }

    function handleToRemoveSpaces() {

     //   var newtext = text.replace(/\s+/g, ' ').trim()
        var newtext = text.split(/[ ]+/);
        console.log(newtext);
        setText(newtext.join(" "));
        console.log(text);
        
    }

    function goToOnchange (event) {

        setText(event.target.value);
        
    }
    function clear() {
        setText("");
        
    }

    const[text,setText]=useState('');

  return (
    <>
        <div className ="container">
            <div className='row my-3'>
                <div className='col-lg-9 '>
                    <h4>{prop.heading}</h4>
                </div>
                <div className='col-lg-1 mx-2'>
                    <button className='btn btn-light' onClick = {download}>Download</button>
                    
                </div>
                <div className='col-lg-1'>
              
                    <button className='btn btn-light' onClick = {clear}>Reset</button>
                </div>
        
        </div>
        
        <div className='container'>
            <div className='row'>
                <textarea className="form-control" placeholder = "Enter text here "value = {text} onChange = {goToOnchange} id="mybox" rows="8"></textarea>
            </div>
           
        </div>
        <div className='row my-2'>
            <button className='btn btn-primary mx-2' onClick = {handleToUpperCase} >Convert To Uppercase</button>
            <button className='btn btn-primary mx-2' onClick = {handleToLowerCase} >Convert To LowerCase</button>
            <button className='btn btn-primary mx-2' onClick = {handleToCopy}>Copy Text</button>
            <button className='btn btn-primary mx-2' onClick = {handleToRemoveSpaces}>Remove Extra Spaces</button>
        </div> 
    </div>
    <div className='container my-3'>
        <h4>Your Text Summary</h4>
         <p>{text.split(" ").length} words and {text.length} characters</p>
          <p>{0.008 * text.split(" ").length} Minutes to read</p>
    </div>
 </>
    
  )
}
