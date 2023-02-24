import React, { useState } from 'react'



export default function Textform(prop) {
    const[text,setText]=useState('');
  //  const [recognizedText, setRecognizedText] = useState('');

    function handleSpeak() {
        if ('speechSynthesis' in window) {
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(text);
          const voices = synth.getVoices();
          utterance.voice = voices.find(v => v.name === 'Google US English');
          utterance.rate = 0.8;
          utterance.pitch = 0.8;
          synth.speak(utterance);
        } else {
          alert('Sorry, your browser does not support speech synthesis.');
        }
      }
      // Speech
 /*     const startRecognition = () => {
        const recognition = new window.webkitSpeechRecognition();
      
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setRecognizedText(transcript);
        }
      
        recognition.start();
        setText(recognizedText)
        console.log(recognizedText)
      }*/
     


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
        const element = document.createElement("a");
        const file = new Blob([document.getElementById('mybox').value],    
                    {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "MyFile.txt";
        document.body.appendChild(element);
        element.click();
        
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

    

  return (
    <>
        <div className ="container">
            <div className='row my-3'>
                <div className='col-lg-9 '>
                    <h4>{prop.heading}</h4>
                </div>
                <div className='col-lg-1 mx-2'>
                    <button className='btn btn-dark' onClick = {download}>Download</button>
                    
                </div>
                <div className='col-lg-1'>
              
                    <button className='btn btn-light' onClick = {clear}>Reset</button>
                </div>
        
        </div>
        
        <div className='container'>
            <div className='row'>
                <textarea className="form-control"  placeholder = "Enter text here "value = {text} onChange = {goToOnchange} id="mybox" rows="8"></textarea>
            </div>
           
        </div>
        <div className='row my-2'>
            <button className='btn btn-dark mx-2' onClick = {handleToUpperCase} >Convert To Uppercase</button>
            <button className='btn btn-dark mx-2' onClick = {handleToLowerCase} >Convert To LowerCase</button>
            <button className='btn btn-dark mx-2' onClick = {handleToCopy}>Copy Text</button>
            <button className='btn btn-dark mx-2' onClick = {handleToRemoveSpaces}>Remove Extra Spaces</button>
            <button className='btn btn-dark mx-2' onClick = {handleSpeak}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
            <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
            </svg>Speech</button>
            
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
