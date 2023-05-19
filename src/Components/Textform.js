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
import { faClock, faEdit, faTrash,faDownload } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'


//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap/dist/js/bootstrap.bundle.min.js";



export default function Textform(prop) {

    const [text, setText] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(true);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [noOfFiles, setnoOfFiles] = useState(0);
    //  const [isSelcted, setisSelcted] = useState('');
    const [currentfileid, setcurrentfileid] = useState('');
  
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [OptionsValue, setoptions] = useState([])
    const usenavigate = useNavigate();
    const url = "https://owcylo27c7.execute-api.us-east-1.amazonaws.com";
    //  const url = "http://localhost:8000";


    useEffect(() => {

        var username = sessionStorage.getItem('username');
        let myInput = document.getElementById("welcome");
        myInput.textContent = "Enter Text To Analyze";

        if (username === '' || username === null) {
            usenavigate('/');
        }
        renderData();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    function renderData() {

        let id = sessionStorage.getItem('username');
      //  const date = new Date();
     //   const options = { timeZone: 'Asia/Kolkata' };
       // const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');

        fetch(url+"/filedata/" + id).then((res) => {
            return res.json();
        }).then((resp) => {
            let myobj = {}
            let options = [];

            if (resp != null) {
                setnoOfFiles(resp.length)

                for (let i = 0; i < resp.length; i++) {
                    console.log("resp[i].fileName", resp[i]['fileName'])
                    myobj['value'] = resp[i]['filename']
                    myobj['textcontent'] = resp[i]['filecontent']
                    myobj['datetime'] = resp[i]['savedatetime']
                    myobj['id'] = resp[i]['uuid']
                    options.push(myobj);
                    myobj = {};
                }
                
                options.reverse()
                setoptions(options)


            } else {
                setnoOfFiles(0)
                setoptions(options)

            }

        })
    }

/*    function getfrombackend() {

        fetch("http://localhost:8000/data").then((res) => {
            return res.json();
        }).then((resp) => {
            console.log(resp)
        })

    }*/

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

    function download(content,filename) {

        const element = document.createElement("a");
        const file = new Blob([content],
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = filename +'.txt';
        document.body.appendChild(element);
        element.click();

     /*   Email.send({
            Host: "gocoders4u@gmail.com",
            Username: "gocoders4u@gmail.com",
            Password: "randhir669@4RKY",
            To: 'randhir669@gmail.com',
            From: "gocoders4u@gmail.com",
            Subject: "Sending Email using javascript",
            Body: "Well that was easy!!",
          })
            .then(function (message) {
              alert("mail sent successfully")
            });*/

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

    function validating_filename(action) {

        saveto()

    }

    function save() {
        setShow(true);
    }

    function myfiles(fileid) {

        setcurrentfileid(fileid)

        if (fileid !== 'My Files') {

            let id = sessionStorage.getItem('username');
            fetch(url+"/filedata/" + id).then((res) => {
                return res.json();
            }).then((resp) => {
                console.log(resp)
                let filetext = ""
                for (let i = 0; i < resp.length; i++) {
                    if (resp[i].uuid === fileid) {
                        filetext = resp[i].filecontent
                    }

                }
                setText(filetext)
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

        let filename = ""
        if (showUpdateButton === true) {
          //  filename = currentfilename;

            alert("Data Updated")
        } else {
            filename = document.getElementById('filename').value
        }

        let username = sessionStorage.getItem('username');
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');

        let textobj = {
            "uuid": parseInt(new Date().toISOString().replace(/[-T:Z]/g,"")),
            "userid": 669,
            "filename": filename,
            "filecontent": text,
            "savedate": formattedDate,
            "filestatus": true,
            "username": username,
            "savedatetime": formattedDate
        }

        fetch(url+"/filedata", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(textobj)
        }).then((res) => {
            //  alert("Data saved")
            renderData()
        }).catch((err) => {
            console.log(err)

        })
    }

    function updatefile() {

        let username = sessionStorage.getItem('username');
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');

        let textobj = {

            "filecontent": text,
            "filestatus": true,
            "username": username,
            "savedatetime": formattedDate
        }

        console.log(textobj)

        
            fetch(url+"/fileupdate/" + currentfileid, {
                method: "PUT",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(textobj)
            }).then((res) => {
                //  alert("Data saved")
                renderData()
                alert("file updated")
            }).catch((err) => {
                console.log(err)

            })

    }

    function Deletefile(fileid) {
     //   alert("file deleted")

        let username = sessionStorage.getItem('username');
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');

        let textobj = {

            "filecontent": text,
            "username": username,
            "savedatetime": formattedDate,
            "filestatus": false

        }

        console.log(textobj)

        Swal.fire({
            title: "Are You Sure?",
            text: "Do You Want To delete this file",
            icon: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
        }).then((result) =>{ 

            if (result.isConfirmed){

            fetch(url+"/fileupdate/" + fileid, {
                method: "PUT",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(textobj)
            }).then((res) => {
                //  alert("Data saved")
                renderData()
    
            }).catch((err) => {
                console.log(err)
    
            })
        }else{

        }


         });
    }

 /*    */

    return (
        <>
            <div className="container mx-3 col-lg-8" style={{ marginleft: '0px' }}>
                
            <Card className="roundborder" style={{ boxShadow: '1px 2px 9px #6c757d', margin: '1em', padding: '1em', }}>
                <div className='row my-3'>
                        <div className='col-lg-8'>
                            <h4 id="welcome">" "</h4>
                            <Badge pill bg="info">
                                Total Files - {noOfFiles}
                            </Badge>

                        </div>
                      { /*   <Form.Group controlId="formFileSm" className="mb-3" aria-disabled>
                           <span> <Form.Control type="file" id="mydoc" onChange={onFileChange}  size="sm" />
                            <Button className='btn btn-dark' size="sm" onClick={onFileUpload}>Save</Button></span>
                           
                        </Form.Group>

                          <div className='col-lg-2'>
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

                        <div className='col-lg-1 ml-auto mr-2'>
                
                            <Button className='btn btn-light mx-1' size="sm" onClick={clear}>Reset</Button>
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
                        {showUpdateButton && <button className='btn btn-dark mx-2 ' onClick={updatefile} >Update</button>}
                       
                    </div>

                    <div className='container my-3'>
                        <h4>Your Text Summary</h4>
                        <p>{text.split(" ").length - 1} words and {text.length} characters</p>
                        <p>{0.008 * text.split(" ").length} Minutes to read</p>
                    </div>
                  
                </Card>

            </div>


            <div className='container col-lg-3 mx-2 scrollable' style={{paddingBottom:'20px'}}>
             {/*  <div className='row'>
                    <Card  style={{ width: '26rem', boxShadow: '1px 2px 9px #6c757d', margin: '1em' }} className="mb-2 roundborder">
                    <form  className='container margintopbottom'>
                    <div className='card'>
                    <Card.Header>
                    <input type="text" placeholder='Search' id="filename" autoFocus className='form-control'></input>
                    </Card.Header>
                    </div>
                    </form>
                    </Card>
                       
                            </div>*/}
                <div className='row '>
                    {OptionsValue.map((option) => (
                        <Card border="dark" style={{ width: '26rem', boxShadow: '1px 2px 9px #6c757d', margin: '1em' }} className="mb-2 cards hover-shadow roundborder ">
                
                       
                        <Card.Header className="d-flex justify-content-between align-items-center">
                                <span><h6>{option.value}</h6></span>
                                <div className=''>
                                <FontAwesomeIcon icon={faDownload} className="" style={{ cursor: 'pointer' }} onClick={() => download(option.textcontent,option.value)} />
                                <FontAwesomeIcon icon={faEdit} className="ml-1" style={{ cursor: 'pointer' }} onClick={() => myfiles(option.id)} />
                                <FontAwesomeIcon icon={faTrash} className="ml-1" style={{ cursor: 'pointer' }} onClick={() => Deletefile(option.id)} />
                                </div>

                            </Card.Header>
                            <Card.Body className = "scrollablecardbody">
                                <Card.Title></Card.Title>
                                <Card.Text>
                                    {option.textcontent}
                                </Card.Text>

                            </Card.Body>
                            <Card.Footer className="justify-content-between align-items-center">
                                <FontAwesomeIcon icon={faClock} className="" style={{ marginRight: '10px' }} />
                                {option.datetime}
                            </Card.Footer>
                           
                         
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
