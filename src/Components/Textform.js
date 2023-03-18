import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

import FloatingLabel from 'react-bootstrap/FloatingLabel'

//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap/dist/js/bootstrap.bundle.min.js";



export default function Textform(prop) {

    const [text, setText] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(true);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [noOfFiles, setnoOfFiles] = useState(0);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [OptionsValue, setoptions] = useState([])
    const usenavigate = useNavigate();

    useEffect(() => {

        var username = sessionStorage.getItem('username');
        let myInput = document.getElementById("welcome");
        myInput.textContent = "Enter Text To Analyze";

        if (username === '' || username === null) {
            usenavigate('/');
        }
        renderData();
    }, []);

    function renderData() {

        let id = sessionStorage.getItem('username');

        fetch("https://my-project-data.onrender.com/text/" + id).then((res) => {
            return res.json();
        }).then((resp) => {
            let filenames = Object.keys(resp)
            setnoOfFiles(filenames.length)
            let myobj = {}
            let options = [{ label: 'My Files' }];
            for (let i = 0; i < filenames.length; i++) {
                if (filenames[i] !== 'id') {
                    myobj['value'] = filenames[i]
                    myobj['label'] = filenames[i]
                    options.push(myobj);
                    myobj = {};
                }
            }
            console.log(options)
            setoptions(options)
        })
    }

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

    function handleToUpperCase() {
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
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = "MyFile.txt";
        document.body.appendChild(element);
        element.click();

    }
    function handleToCopy() {

        var copyText = document.getElementById("mybox");
        copyText.select();
        navigator.clipboard.writeText(copyText.value);
    }

    function handleToRemoveSpaces() {
        var newtext = text.split(/[ ]+/);
        setText(newtext.join(" "));
    }

    function goToOnchange(event) {
        setText(event.target.value);

    }
    function clear() {
        setText("");
        if (showUpdateButton === true) {
            setShowUpdateButton(false);
            setShowSaveButton(true);
        }
    }

    function validating_filename() {

        console.log("validating_filename")
        let newfilename = document.getElementById('filename').value
        let id = sessionStorage.getItem('username');

        fetch("https://my-project-data.onrender.com/text/" + id).then((res) => {
            return res.json();
        }).then((resp) => {
            let filenames = Object.keys(resp)

            console.log(filenames)
            console.log(filenames.includes(newfilename))
            if (filenames.includes(newfilename)) {
                alert('filename exist')
            } else {
                saveto()

                let myobj = {}
                myobj['value'] = newfilename;
                myobj['label'] = newfilename;
                OptionsValue.push(myobj)
                setoptions(OptionsValue)
                setnoOfFiles(OptionsValue.length)
                //  setText('')
            }
        })
    }

    function save() {
        setShow(true);
    }

    function myfiles() {

        var e = document.getElementById("floatingSelect");
        var fileName = e.value;

        if (fileName !== 'My Files') {

            let id = sessionStorage.getItem('username');
            fetch("https://my-project-data.onrender.com/text/" + id).then((res) => {
                return res.json();
            }).then((resp) => {
                console.log(resp)
                let myobj = resp;
                let filecontent = myobj[fileName]
                console.log(myobj[filecontent])
                setText(filecontent)
                if (showUpdateButton === false) {
                    setShowUpdateButton(true);
                    setShowSaveButton(false);
                }

            })
        } else {

            setText('')
            if (showUpdateButton === true) {
                setShowUpdateButton(false);
                setShowSaveButton(true);
            }
        }
    }

    function saveto() {

        setShow(false);
        let filename
        if (showUpdateButton === true) {
            filename = document.getElementById("floatingSelect").value;
            alert("Data Updated")
        } else {
            filename = document.getElementById('filename').value
        }

        let id = sessionStorage.getItem('username');
        let textobj = {}
        textobj['id'] = id;
        textobj[filename] = text;
        console.log(textobj)

        fetch("https://my-project-data.onrender.com/text/" + id).then((res) => {
            return res.json();
        }).then((resp) => {
            console.log(resp)
            var myobj = resp;
            console.log(Object.keys(resp))
            if (Object.keys(resp).length === 0) {

                fetch("https://my-project-data.onrender.com/text", {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(textobj)
                }).then((res) => {
                    //  alert("Data saved")
                }).catch((err) => {
                    console.log(err)

                })

            } else {
                fetch('https://my-project-data.onrender.com/text/' + id, {
                    method: 'DELETE',
                })
                    .then((res) => {
                        myobj[filename] = text
                        console.log(myobj)
                        fetch("https://my-project-data.onrender.com/text", {
                            method: "POST",
                            headers: { 'content-type': 'application/json' },
                            body: JSON.stringify(myobj)
                        }).then((res) => {
                            //  alert(res.text());
                        }).catch((err) => {
                            alert("Not Registerd")
                        })
                    }) // or res.json()
                    .then(res => console.log(res))
                     console.log("Deleted Data ")

            }
        }).catch((err) => {
            alert(err.message)
        })
    }

    return (
        <>
            <div className="container">
                <div className='row my-3'>

                    <div className='col-lg-7'>
                        <h4 id="welcome">" "</h4>
                        <Badge pill bg="info">
                            Total Files - {noOfFiles - 1}
                        </Badge>
                    </div>

                    <div className='col-lg-2'>
                        <FloatingLabel controlId="floatingSelect" label="" onChange={myfiles}>
                            <Form.Select aria-label="Default select example" size="sm" style = {{border: 'none' , backgroundColor: '#343a40'  , color: '#fff',height: '33px'}} className='form-control'>
                                {OptionsValue.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select >
                        </FloatingLabel>
                    </div>

                    <div className='col-lg-1'>
                        <Button className='btn btn-dark' size="sm" onClick={download}>Download</Button>
                    </div>
                    <div className='col-lg-1'>
                        <Button className='btn btn-light' size="sm" onClick={clear}>Reset</Button>
                    </div>
                </div>

                <div className='container'>
                    <div className='row'>
                        <textarea className="form-control" style={{ fontWeight: 'bold' }} placeholder="Enter text here " value={text} onChange={goToOnchange} id="mybox" rows="8"></textarea>
                    </div>
                </div>
                { /* <div className='row my-2'>
                    <button className='btn btn-dark mx-2' onClick={handleToUpperCase} >Convert To Uppercase</button>
                    <button className='btn btn-dark mx-2' onClick={handleToLowerCase} >Convert To LowerCase</button>
                    <button className='btn btn-dark mx-2' onClick={handleToCopy}>Copy Text</button>
                    <button className='btn btn-dark mx-2' onClick={handleToRemoveSpaces}>Remove Extra Spaces</button>
                    <button className='btn btn-dark mx-2' onClick={handleSpeak}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
                        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
                    </svg>Speech</button>
                   </div>*/}
                <div className='row my-2 mx-1'>
                    <DropdownButton id="dropdown-item-button-dark" className="" variant="dark" title="Text Action">
                        <Dropdown.Item as="button" variant="dark" menuVariant="dark" onClick={handleToUpperCase} >Convert To Uppercase</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={handleToLowerCase} >Convert To LowerCase</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={handleToCopy} >Copy Text</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={handleToRemoveSpaces} >Remove Extra Spaces</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={handleSpeak}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
                            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                            <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
                        </svg>Speech</Dropdown.Item>

                    </DropdownButton>
                    {showSaveButton && <button className='btn btn-dark mx-2' onClick={save} >Save</button>}
                    {showUpdateButton && <button className='btn btn-dark mx-2 ' onClick={saveto} >update</button>}
                </div>

            </div>
            <div className='container my-3'>
                <h4>Your Text Summary</h4>
                <p>{text.split(" ").length} words and {text.length} characters</p>
                <p>{0.008 * text.split(" ").length} Minutes to read</p>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>File Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="File Name"
                                id="filename"
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={validating_filename}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}
