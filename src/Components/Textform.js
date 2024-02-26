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
import { faCopy, faClock, faEdit, faTrash, faDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


export default function Textform(prop) {

    const [text, setText] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(true);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [noOfFiles, setnoOfFiles] = useState(0);
    const [currentfileid, setcurrentfileid] = useState('');
    const [loaddata, setloaddata] = useState(true)
    const [show, setShow] = useState(false);
    const [OptionsValue, setoptions] = useState([])
    const [allfiles, setallfiles] = useState([])
    const [allstarredfiles, setallstarredfiles] = useState([])
    const usenavigate = useNavigate();
    const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com";
  //  const url = "http://localhost:8000";


    useEffect(() => {

        var username = sessionStorage.getItem('username');
        let myInput = document.getElementById("welcome");
        myInput.textContent = "Enter Your Notes";

        if (username === '' || username === null) {
            usenavigate('/');
        }
        async function fetchalldata() {
            await renderData();
            setloaddata(false)
        }
        fetchalldata()

    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    async function renderData() {

        let id = sessionStorage.getItem('username');
        let response = await fetch(url + "/filedata/" + id)
        if (response.ok) {
            let resp = await response.json()
            let options
            if (resp !== null) {
                options = [...resp];
                setnoOfFiles(resp.length)
                setallfiles(options)
                setoptions(options.reverse())
                let starred = options.filter((option) => option.isstarred)
                setallstarredfiles(starred)
            } else {
                setnoOfFiles(0)
                setoptions(options)
            }
        }
    }

    function showFiles(type) {
        var starredbtnElement = document.getElementById('starrednotes');
        var allbtnElement = document.getElementById('allnotes');

        // Reset styles for both buttons
        starredbtnElement.style.backgroundColor = '';
        starredbtnElement.style.color = '';
        allbtnElement.style.backgroundColor = '';
        allbtnElement.style.color = '';

        // Apply styles based on the type parameter
        if (type === 'starred') {
            starredbtnElement.style.backgroundColor = '#28a745';
            starredbtnElement.style.color = 'white';
            setoptions(allstarredfiles);
        } else if (type === 'all') {
            allbtnElement.style.backgroundColor = '#28a745';
            allbtnElement.style.color = 'white';
            setoptions(allfiles);
        }
    }
    const handleClose = () => setShow(false);
    function actionontext(type) {
        let currentText = text;

        if (type === 'uppercase') {
            let newText = currentText.toUpperCase();
            setText(newText);
        }
        if (type === 'lowercase') {
            var newText = text.toLowerCase();
            setText(newText);
        }

        if (type === 'copy') {
            var copyText = document.getElementById("mybox");
            copyText.select();
            navigator.clipboard.writeText(copyText.value);
        }

        if(type==='removespaces'){
            var newtext = text.split(/[ ]+/);
            setText(newtext.join(" "));
        }

        if(type==='clear'){
            setText("");
        if (showUpdateButton === true) {
            setShowUpdateButton(false);
            setShowSaveButton(true);
        }
        }

    }
    
    function download(content, filename) {

        const element = document.createElement("a");
        const file = new Blob([content],
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = filename + '.txt';
        document.body.appendChild(element);
        element.click();

    }
   
    function Copycontent(id) {

        var cardTextElement = document.getElementById(id);
        cardTextElement.style.backgroundColor = '#B4D5FF'
        var textToCopy = cardTextElement.textContent;
        var textarea = document.createElement("textarea");
        textarea.value = textToCopy;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        document.body.removeChild(textarea);
        setTimeout(function () {
            cardTextElement.style.backgroundColor = ''
        }, 2000);
    }

    function goToOnchange(event) {
        setText(event.target.value);

    }
    
    function save() {
        if(text!==''){
            setShow(true);
        }
        
    }

    function editfiles(fileid) {
        setcurrentfileid(fileid)
        let currentfile = allfiles.filter(allfile => {
            return allfile.uuid === fileid
        })
        setText(currentfile[0].filecontent)
        if (showUpdateButton === false) {
            setShowUpdateButton(true);
            setShowSaveButton(false);
        }

    }

    function saveto() {

        setShow(false);
        let filename = document.getElementById('filename').value
        let username = sessionStorage.getItem('username');
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');

        let textobj = {
            "uuid": parseInt(new Date().toISOString().replace(/[-T:Z]/g, "")),
            "userid": 669,
            "filename": filename,
            "filecontent": text,
            "savedate": formattedDate,
            "filestatus": true,
            "username": username,
            "savedatetime": formattedDate,
            "isstarred": false,
        }
        fetch(url + "/filedata", {
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
        fetch(url + "/fileupdate/" + currentfileid, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(textobj)
        }).then((res) => {
            renderData()
            alert("file updated")
        }).catch((err) => {
            console.log(err)

        })

    }

    function Deletefile(fileid) {
       
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
        }).then((result) => {

            if (result.isConfirmed) {

                fetch(url + "/fileupdate/" + fileid, {
                    method: "PUT",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(textobj)
                }).then((res) => {
                    //  alert("Data saved")
                    renderData()

                }).catch((err) => {
                    console.log(err)

                })
            } else {

            }


        });
    }

    function toggleStarred(fileid, status) {

        let username = sessionStorage.getItem('username');
        let textobj = {
            "username": username,
            "isstarred": !status
        }

        fetch(url + "/isstarred/" + fileid, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(textobj)
        }).then((res) => {
            renderData()
        }).catch((err) => {
            console.log(err)

        })

    }

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

                        <div className='col-lg-1 ml-auto mr-2'>
                            <Button className='btn btn-light mx-1' size="sm" onClick={()=>actionontext('clear')}>Reset</Button>
                        </div>

                    </div>

                    <div className='container'>
                        <div className='row'>
                            <textarea className="form-control" style={{ fontWeight: 'bold' }} placeholder="Enter text here " value={text} onChange={goToOnchange} id="mybox" rows="8"></textarea>
                        </div>
                    </div>
                    <div className='row my-2 mx-1'>
                        <DropdownButton id="dropdown-item-button-dark" className="" variant="dark" title="Text Action">
                            <Dropdown.Item as="button" variant="dark" menuVariant="dark" onClick={()=>actionontext('uppercase')} >Convert To Uppercase</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={()=>actionontext('lowercase')} >Convert To LowerCase</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={()=>actionontext('copy')} >Copy Text</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={()=>actionontext('removespaces')} >Remove Extra Spaces</Dropdown.Item>

                        </DropdownButton>
                        {showSaveButton && <button className='btn btn-dark mx-2' onClick={save} >Save</button>}
                        {showUpdateButton && <button className='btn btn-dark mx-2 ' onClick={updatefile} >Update</button>}

                    </div>

                    <div className='container my-3'>
                        {/*  <h4>Your Text Summary</h4>
                        <p>{text.split(" ").length - 1} words and {text.length} characters</p>
                        <p>{0.008 * text.split(" ").length} Minutes to read</p>*/}
                    </div>

                </Card>

            </div>


            <div className='container col-lg-3 mx-2 ' style={{ paddingBottom: '20px' }}>

                <Button className='btn my-2 ml-2 mr-2' variant="outline-success" id='allnotes' style={{ backgroundColor: '#28a745', color: 'white' }} onClick={() => showFiles('all')} >All</Button>
                <Button className='btn my-2 ml-2 mr-2' variant="outline-success" id='starrednotes' onClick={() => showFiles('starred')}>Starred</Button>
                <div className='row scrollable'>
                    {OptionsValue.map((option) => (
                        <Card border="dark" style={{ width: '26rem', boxShadow: '1px 2px 9px #6c757d', margin: '1em' }} className="mb-2 cards hover-shadow roundborder ">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <span><h6>{option.username}</h6></span>
                                <div className=''>
                                    <FontAwesomeIcon icon={faCopy} className="" style={{ cursor: 'pointer' }} onClick={() => Copycontent(option.uuid)} />
                                    <FontAwesomeIcon icon={faDownload} className="ml-1" style={{ cursor: 'pointer' }} onClick={() => download(option.filecontent, option.username)} />
                                    <FontAwesomeIcon icon={faEdit} className="ml-1" style={{ cursor: 'pointer' }} onClick={() => editfiles(option.uuid)} />
                                    <FontAwesomeIcon icon={faTrash} className="ml-1" style={{ cursor: 'pointer' }} onClick={() => Deletefile(option.uuid)} />
                                </div>

                            </Card.Header>
                            <Card.Body className="scrollablecardbody" >
                                <Card.Title></Card.Title>
                                <Card.Text id={option.uuid}>
                                    {option.filecontent}
                                </Card.Text>

                            </Card.Body>
                            <Card.Footer className="justify-content-between align-items-center">
                                <FontAwesomeIcon icon={faClock} className="" style={{ marginRight: '10px' }} />
                                {option.savedatetime}
                                <FontAwesomeIcon icon={faStar} onClick={() => toggleStarred(option.uuid, option.isstarred)} style={{ cursor: 'pointer', marginLeft: '100px' }} color={option.isstarred ? 'gold' : 'grey'} />
                            </Card.Footer>
                        </Card>
                    ))}
                </div>
                {loaddata && <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>}
            </div>


            <Modal show={show} onHide={handleClose}>

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
                    <Button variant="dark" onClick={saveto}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>
            </div>
        </>

    )
}
