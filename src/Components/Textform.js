import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';



//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap/dist/js/bootstrap.bundle.min.js";



export default function Textform(prop) {

    const [text, setText] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(true);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [noOfFiles, setnoOfFiles] = useState(0);
  //  const [isSelcted, setisSelcted] = useState('');
    const [currentfilename, setcurrentfilename] = useState('');
  //  const [mydoc, setmydoc] = useState('');
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
            console.log(resp['Docker'])
            setnoOfFiles(filenames.length)
            let myobj = {}
            let options = [];
            for (let i = 0; i < filenames.length; i++) {
                if (filenames[i] !== 'id') {
                    myobj['value'] = filenames[i]
                    myobj['label'] = filenames[i]
                    myobj['textcontent'] = resp[filenames[i]]
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
                myobj['textcontent'] = text;
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

    function myfiles(fileName) {

        // var e = document.getElementById("floatingSelect");
        // var fileName = e.value;
        setcurrentfilename(fileName)
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
            filename = currentfilename;

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

    function deletefile() {

    }

    return (
        <>
            <div className="container mx-3 col-lg-8" style={{ marginleft: '0px' }}>
                <Card className="roundborder" style={{ boxShadow: '1px 2px 9px #6c757d', margin: '1em', padding: '1em', }}>
                    <div className='row my-3'>
                        <div className='col-lg-8'>
                            <h4 id="welcome">" "</h4>
                            <Badge pill bg="info">
                                Total Files - {noOfFiles - 1}
                            </Badge>

                        </div>
                        { /* <Form.Group controlId="formFileSm" className="mb-3">
                           <span> <Form.Control type="file" id="mydoc" onChange={gotofile} size="sm" />
                            <Button className='btn btn-dark' size="sm" onClick = {saveMydoc}>Save</Button></span>
                           
                        </Form.Group>/*}

                        { /*   <div className='col-lg-2'>
                        <FloatingLabel controlId="floatingSelect" label="" onChange={myfiles}>
                            <Form.Select aria-label="Default select example" size="sm" style={{ border: 'none', backgroundColor: '#343a40', color: '#fff', height: '33px' }} className='form-control'>
                                {OptionsValue.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select >
                        </FloatingLabel>
                                </div>*/}

                        <div className='col-lg-1 mr-3'>
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
                        {showUpdateButton && <button className='btn btn-dark mx-2 ' onClick={saveto} >Update</button>}
                        {showUpdateButton && <button className='btn btn-dark' onClick={deletefile} >Delete</button>}
                    </div>

                    <div className='container my-3'>
                        <h4>Your Text Summary</h4>
                        <p>{text.split(" ").length} words and {text.length} characters</p>
                        <p>{0.008 * text.split(" ").length} Minutes to read</p>
                    </div>
                </Card>

            </div>


            <div className='container col-lg-3 scrollable'>
                <div className='row'>
                    {OptionsValue.map((option) => (

                        <Card border="dark" style={{ width: '26rem', boxShadow: '1px 2px 9px #6c757d', margin: '1em' }} className="mb-2 cards hover-shadow roundborder ">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <span>{option.value}</span>
                                <div className=''>
                                    <FontAwesomeIcon icon={faEdit} className="" style={{ cursor: 'pointer' }} onClick={() => myfiles(option.value)} />
                                    <FontAwesomeIcon icon={faTrash} className="ml-1" style={{ cursor: 'pointer' }} />
                                </div>

                            </Card.Header>
                            <Card.Body>
                                <Card.Title></Card.Title>
                                <Card.Text>
                                    {option.textcontent}
                                </Card.Text>
                            </Card.Body>

                        </Card>
                    ))}
                </div>
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
                    <Button variant="light" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="dark" onClick={validating_filename}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>


            </div>



        </>

    )
}
