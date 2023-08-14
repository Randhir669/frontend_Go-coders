import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";



export default function Filemanager() {
    // eslint-disable-next-line
    const [mydoc, setmydoc] = useState('');
    const [myalldoc, setmyalldoc] = useState([]);
    const usenavigate = useNavigate();
    const [OptionsValue, setoptions] = useState([])
    const [historyOptionsValue, setoptionsofhistory] = useState([])
    const [alluserlist, setallusers] = useState([])
    const MySwal = withReactContent(Swal)
    const [Save, setSave] = useState('Save')
    const [showfiles, setShowFiles] = useState(true)
    const [showfilesHistory, setShowHistory] = useState(false)
    const [Send, setSend] = useState('Send')

    const [selectedUser, setSelectedUser] = useState('');
    const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com";
    // const url = "http://localhost:8000";


    const handleChangeUser = (selectedUser) => {
        setSelectedUser(selectedUser);
    };

    useEffect(() => {

        var username = sessionStorage.getItem('username');
        if (username === '' || username === null) {
            usenavigate('/');
        }

    });// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        renderAllUsers()

    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        historyOfSharedDocs()

    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        renderAllDocs()
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let timeoutId = setTimeout(logout, 600000);
        console.log(timeoutId) 
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    function logout() {
          usenavigate('/');

    }


    function Showfiles() {
        renderAllDocs()
        setShowFiles(true)
        setShowHistory(false)

        var filesbtnElement = document.getElementById('files');
        filesbtnElement.style.backgroundColor = '#28a745'
        filesbtnElement.style.color = 'white'

        var historybtnElement = document.getElementById('history');
        historybtnElement.style.backgroundColor = ''
        historybtnElement.style.color = ''

        var starredbtnElement = document.getElementById('starred');
        starredbtnElement.style.backgroundColor = ''
        starredbtnElement.style.color = ''
    }

    function ShowfilesHistory() {
        setShowFiles(false)
        setShowHistory(true)
        var historybtnElement = document.getElementById('history');
        historybtnElement.style.backgroundColor = '#28a745'
        historybtnElement.style.color = 'white'

        var filesbtnElement = document.getElementById('files');
        filesbtnElement.style.backgroundColor = ''
        filesbtnElement.style.color = ''

        var starredbtnElement = document.getElementById('starred');
        starredbtnElement.style.backgroundColor = ''
        starredbtnElement.style.color = ''
    }

    function renderAllUsers() {

        fetch(url + "/userdata").then((res) => {
            return res.json();
        }).then((resp) => {
            let userobj = {}
            let allusersnames = [];
            let cid = sessionStorage.getItem('username');
            if (resp != null) {

                for (let i = 0; i < resp.length; i++) {
                    if (resp[i]['id'] !==cid) {
                        userobj['label'] = resp[i]['id']
                        userobj['value'] = resp[i]['id']
                        allusersnames.push(userobj);
                        userobj = {};
                    }
                }
                setallusers(allusersnames)
            } else {
                setallusers(allusersnames)
            }
        })
    }
    function renderAllDocs() {
        let id = sessionStorage.getItem('username');

        fetch(url + "/alldoc/" + id).then((res) => {
            return res.json();
        }).then((resp) => {

            let myobj = {}
            let options = [];
            let docobj = {};
            let alldocnames = [];

            if (resp != null) {

                for (let i = 0; i < resp.length; i++) {

                    myobj['id'] = i + 1
                    myobj['filename'] = resp[i]['filename']
                    myobj['Dateandtime'] = resp[i]['savedatetime']
                    myobj['sendBy'] = resp[i]['sendby']
                    myobj['download'] = <Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(resp[i]['filename'])}>Download</Button>
                    myobj['action'] = <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(resp[i]['fid'])} />
                    myobj['fid'] = resp[i]['fid']
                    myobj['isstarred'] = resp[i]['isstarred']
                    docobj['label'] = resp[i]['filename']
                    docobj['value'] = resp[i]['fid']
                    alldocnames.push(docobj)
                    options.push(myobj);
                    docobj = {};
                    myobj = {};

                }
                setoptions(options)
            } else {
                setoptions(options)
            }
        })
    }

    function historyOfSharedDocs() {

        let id = sessionStorage.getItem('username');

        fetch(url + "/allhistorydoc/" + id).then((res) => {
            return res.json();
        }).then((resp) => {

            let myobj = {}
            let options = [];
            let docobj = {};
            let alldocnames = [];

            if (resp != null) {

                for (let i = 0; i < resp.length; i++) {

                    myobj['id'] = i + 1
                    myobj['filename'] = resp[i]['filename']
                    myobj['Dateandtime'] = resp[i]['savedatetime']
                    myobj['sendTo'] = resp[i]['username']
                    myobj['download'] = <Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(resp[i]['filename'])}>Download</Button>
                    myobj['action'] = <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(resp[i]['fid'])} />
                    myobj['fid'] = resp[i]['fid']
                    docobj['label'] = resp[i]['filename']
                    docobj['value'] = resp[i]['fid']
                    alldocnames.push(docobj)
                    options.push(myobj);
                    docobj = {};
                    myobj = {};

                }
                setoptionsofhistory(options)
            } else {
                setoptionsofhistory(options)
            }


        })
    }

    function renderStarredDocs() {

        setShowFiles(true)
        setShowHistory(false)

        var starredbtnElement = document.getElementById('starred');
        starredbtnElement.style.backgroundColor = '#28a745'
        starredbtnElement.style.color = 'white'

        var historybtnElement = document.getElementById('history');
        historybtnElement.style.backgroundColor = ''
        historybtnElement.style.color = ''

        var filesbtnElement = document.getElementById('files');
        filesbtnElement.style.backgroundColor = ''
        filesbtnElement.style.color = ''


        let myobj = {}
        let options = [];
        let docobj = {};
        let alldocnames = [];

        debugger

        for (let i = 0, j = 0; i < OptionsValue.length; i++) {
            if (OptionsValue[i]['isstarred']) {
                myobj['id'] = ++j
                myobj['filename'] = OptionsValue[i]['filename']
                myobj['Dateandtime'] = OptionsValue[i]['Dateandtime']
                myobj['sendBy'] = OptionsValue[i]['sendBy']
                myobj['download'] = <Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(OptionsValue[i]['filename'])}>Download</Button>
                myobj['action'] = <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(OptionsValue[i]['fid'])} />
                myobj['fid'] = OptionsValue[i]['fid']
                myobj['isstarred'] = OptionsValue[i]['isstarred']
                docobj['label'] = OptionsValue[i]['label']
                docobj['value'] = OptionsValue[i]['value']
                alldocnames.push(docobj)
                options.push(myobj);
                docobj = {};
                myobj = {};
            }

        }
        setoptions(options)

    }

    function Onsharefiles() {

        const formData = new FormData();
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');
        const inputField = document.getElementById("sharedoc");

        let sendto = selectedUser.value; //"Admin"//sessionStorage.getItem('username');
        let sendBy = sessionStorage.getItem('username');




        if (document.getElementById("sharedoc").value === '') {
            MySwal.fire({
                title: <strong>File not found!</strong>,
                html: <i>please choose a file to upload</i>,
                icon: 'warning'
            })
        } else if (selectedUser === '') {
            MySwal.fire({
                title: <strong>User not found!</strong>,
                html: <i>please choose a user to share file</i>,
                icon: 'warning'
            })

        } else {
            setSend('Sending...')
            formData.append(
                "myFile",
                mydoc,
                mydoc.fileName,

            );
            formData.append('username', sendto);
            formData.append('savedatetime', formattedDate);
            formData.append('sendBy', sendBy)

            fetch(url + "/fileupload", {
                method: "POST",
                body: formData
            }).then((res) => {
                MySwal.fire({
                    title: <strong>Sent!</strong>,
                    html: <i>Data Shared Successfully!</i>,
                    icon: 'success'
                })
                inputField.value = '';
                setSelectedUser('');
                setSend('Send')
                historyOfSharedDocs();
                renderAllDocs();

            }).catch((err) => {
                console.log(err)

            })

        }
    }

    function onFileChange(event) {
        debugger
        // eslint-disable-next-line
        const selectedfiles = event.target.files
        let filesize = event.target.files[0].size / 1048576;
        if (filesize > 10) {
            MySwal.fire({
                title: <strong>File size Exceeds!</strong>,
                html: <i>please choose a file of less than 10MB</i>,
                icon: 'warning'
            })
            const inputField = document.getElementById("mydoc");
            const shareFileInputField = document.getElementById("sharedoc");
            inputField.value = '';
            shareFileInputField.value = '';
        } else {
            //  setmydoc(event.target.files[0])
            setmyalldoc(event.target.files)
            console.log("myalldoc", myalldoc)

        }

    }

    function onFileUpload() {

        debugger
        if (document.getElementById("mydoc").value === '') {
            MySwal.fire({
                title: <strong>File not found!</strong>,
                html: <i>please choose a file to upload</i>,
                icon: 'warning'
            })
        } else {
            setSave('Saving...')

            for (let i = 0; i < myalldoc.length; i++) {
                debugger
                const formData = new FormData();
                const date = new Date();
                const options = { timeZone: 'Asia/Kolkata' };
                const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');
                const inputField = document.getElementById("mydoc");
                let username = sessionStorage.getItem('username');
                let sendBy = ''

                /*    if (document.getElementById("mydoc").value === '') {
                        MySwal.fire({
                            title: <strong>File not found!</strong>,
                            html: <i>please choose a file to upload</i>,
                            icon: 'warning'
                        })
                    } else {*/

                formData.append(
                    "myFile",
                    myalldoc[i],
                    myalldoc[i].fileName,

                );
                formData.append('username', username);
                formData.append('savedatetime', formattedDate);
                formData.append('sendBy', sendBy)
                fetch(url + "/fileupload", {
                    method: "POST",
                    body: formData
                }).then((res) => {
                    console.log("Data Upload Successfully")
                    inputField.value = '';
                    //   renderAllDocs()
                    //   setSave('Save')

                }).catch((err) => {
                    console.log(err)

                })
            }
        }
        renderAllDocs()
        setSave('Save')
    }

    function ondownload(filename) {

        fetch(url + "/filedownload/" + filename).then((res) => {
            return res.blob();
        }).then(blob => {
            // create a temporary URL to the blob
            const url = URL.createObjectURL(blob);
            // create a link element and click it to initiate download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

    function Deletefile(fid) {

        let username = sessionStorage.getItem('username');
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');

        let textobj = {

            "username": username,
            "savedatetime": formattedDate,
            "docstatus": false

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

                fetch(url + "/deletefile/" + fid, {
                    method: "PUT",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(textobj)
                }).then((res) => {
                    //  alert("Data saved")
                    renderAllDocs()
                    historyOfSharedDocs()

                }).catch((err) => {
                    console.log(err)

                })
            } else {

            }


        });

    }

    function toggleStarred(fid, status) {
        var option = OptionsValue;
        console.log("option", option)
        // eslint-disable-next-line
        let element = document.getElementById(fid)
        debugger
        if (status) {
            element.setAttribute('color', 'grey');
        } else {
            element.setAttribute('color', 'gold');
        }
        for (let i = 0; i < option.length; i++) {
            debugger
            if (option[i].fid === fid) {
                let status = OptionsValue[i].isstarred
                option[i].isstarred = !status
            }
        }

        setoptions(option)

        let username = sessionStorage.getItem('username');

        let textobj = {

            "username": username,
            "isstarred": !status

        }

        fetch(url + "/starredfile/" + fid, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(textobj)
        }).then((res) => {
            //  alert("Data saved")
            //   renderAllDocs()
            //  historyOfSharedDocs()

        }).catch((err) => {
            console.log(err)

        })

    }

    let obj = {
        list: "Test"
      };
      const [todo, settodo] = useState([obj]);
    
      function handletoaddTodo () {
        let element = document.getElementById("todo");
        let value = element.value;
        let temp = todo;
        let obj = {
          list: value
        };
    
        temp.push(obj);
    
        settodo(temp);
    }

    return (
        <>
            <div className="container mx-3 col-lg-5 my-5" style={{ marginleft: '0px' }}>

                <Card>
                    <Card.Header className='card text-center' style={{ backgroundColor: 'black', color: 'white' }}>
                        <h4> File Upload Section</h4>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Browse A File To Upload</Form.Label>
                            <Form.Control type="file" id="mydoc" onChange={onFileChange} />
                            <span><Button className='btn btn-dark my-2' size="" onClick={onFileUpload}>{Save}</Button></span>
                        </Form.Group>
                    </Card.Body>

                </Card>
                <Card className='margintopbottom'>
                    <Card.Header className='card text-center' style={{ backgroundColor: 'black', color: 'white' }}>
                        <h4>Share Files</h4>
                    </Card.Header>
                    <Card.Body>
                        <div className='row'>
                            <Form.Group controlId="formFile" className="col-lg-6">
                                <h6>Users</h6>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select user"
                                    isLoading={false}
                                    isClearable={true}
                                    isSearchable={true}
                                    name="color"
                                    id="user"
                                    value={selectedUser}
                                    onChange={handleChangeUser}
                                    options={alluserlist}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="col-lg-6">
                                <Form.Label>Browse A File To Share</Form.Label>
                                <Form.Control type="file" id="sharedoc" onChange={onFileChange} />
                            </Form.Group>
                        </div>
                        <span><Button className='btn btn-dark my-2' size="" onClick={Onsharefiles}>{Send}</Button></span>

                    </Card.Body>
                </Card>
            </div>
            <div className="container mx-3 col-lg-6 my-5 " style={{ marginleft: '0px' }}>
                <Card>
                    <Card.Header className='card text-center' style={{ backgroundColor: 'black' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button className='btn my-2' variant="outline-success" id='starred' onClick={renderStarredDocs}>Starred</Button>
                            <Button className='btn my-2 ml-2' variant="outline-success" id='files' style={{ backgroundColor: '#28a745', color: 'white' }} onClick={Showfiles}>Files</Button>
                            <Button className='btn my-2 ml-2 mr-2' variant="outline-success" id='history' onClick={ShowfilesHistory}>History</Button>
                        </div>
                        {/*  <h4 style={{ color: 'white' }}>List of Files</h4>*/}
                    </Card.Header>
                </Card>

                {showfiles && (
                    <div>
                        <Table striped bordered hover size="sm" style={{ overflow: 'y', height: '100%' }}>

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>File Title</th>
                                    <th>DateandTime</th>
                                    <th>Download</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OptionsValue.map(option => (
                                    <tr key={option.id}>
                                        <td>{option.id}</td>
                                        <td>{option.filename}&nbsp;&nbsp; <FontAwesomeIcon icon={faStar} id={option.fid} onClick={() => toggleStarred(option.fid, option.isstarred)} style={{ cursor: 'pointer', }} color={option.isstarred ? 'gold' : 'grey'} /></td>
                                        <td>{option.Dateandtime}{option.sendBy ? <b><br></br>SentBy: {option.sendBy}</b> : ''}</td>
                                        <td><Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(option.filename)}>Download</Button> </td>
                                        <td> <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(option.fid)} /></td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                    </div>
                )}
                {showfilesHistory && (
                    <div>
                        <Table striped bordered hover size="sm" style={{ overflow: 'y' }}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>File Title</th>
                                    <th>DateandTime</th>
                                    <th>Download</th>
                                    <th>Action</th>
                                    <th>SendTo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyOptionsValue.map(option => (
                                    <tr key={option.id}>
                                        <td>{option.id}</td>
                                        <td>{option.filename}</td>
                                        <td>{option.Dateandtime}</td>
                                        <td><Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(option.filename)}>Download</Button> </td>
                                        <td> <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(option.fid)} /></td>
                                        <td><b>{option.sendTo}</b></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}

            </div>
            <div className="container mx-3 col-lg-6 margintopbottom" style={{ marginleft: '0px' }}>

                <input
                    className="formControl"
                    id="todo"
                    type="text"
                    placeholder="Todo"
                ></input>
                <button style={{ marginLeft: "5px" }} onClick={handletoaddTodo}>
                    Add
                </button>
                {todo.map((option) => (
                    <ul>{option.list}</ul>
                ))}

            </div>
        </>
    )
}
