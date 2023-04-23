import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";



export default function Filemanager() {

    const [mydoc, setmydoc] = useState('');
    const usenavigate = useNavigate();
    const [OptionsValue, setoptions] = useState([])
    const [alldocslist, setalldoc] = useState([])
    const [alluserlist , setallusers] = useState([])
    const MySwal = withReactContent(Swal)
    const [Save, setSave] = useState('Save')

    const [selectedOption, setSelectedOption] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption); 
    };

    const handleChangeUser = (selectedUser) => {
      
        setSelectedUser(selectedUser);
        
    };

    useEffect(() => {

        var username = sessionStorage.getItem('username');
        if (username === '' || username === null) {
            usenavigate('/');
        }
     //   renderAllDocs();
     //   renderAllUsers();
    },[]);

    function renderAllUsers() {

        fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/data").then((res) => {
            return res.json();
        }).then((resp) => {
            let userobj = {}
            let allusersnames = [];
            if (resp != null) {

                for (let i = 0; i < resp.length; i++) {
                    userobj['label'] = resp[i]['id']
                    userobj['value'] = resp[i]['id']
                    allusersnames.push(userobj);
                    userobj = {};
                }
                setallusers(allusersnames)


            }else{
                setallusers(allusersnames)
            }
        })   
    }

    function renderAllDocs() {
        let id = sessionStorage.getItem('username');

        fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/alldoc/" + id).then((res) => {
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
                setoptions(options)
                setalldoc(alldocnames)

            } else {
                setoptions(options)
                setalldoc(alldocnames)
            }
        })
    }

    function Onsharefiles(){
        MySwal.fire({
            title: <strong>Coming Soon!</strong>,
            html: <i>currently not working</i>,
            icon: 'warning'
        })

    }

    function onFileChange(event) {

        setmydoc(event.target.files[0])
    }

    function onFileUpload() {
        const formData = new FormData();
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');
        const inputField = document.getElementById("mydoc");
        let username = sessionStorage.getItem('username');


        if (document.getElementById("mydoc").value === '') {
            MySwal.fire({
                title: <strong>File not found!</strong>,
                html: <i>please choose a file to upload</i>,
                icon: 'warning'
            })
        } else {
            setSave('Saving...')
            formData.append(
                "myFile",
                mydoc,
                mydoc.fileName,

            );
            formData.append('username', username);
            formData.append('savedatetime', formattedDate);

            fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/fileupload", {
                method: "POST",
                body: formData
            }).then((res) => {
                console.log("Data Upload Successfully")
                inputField.value = '';
                renderAllDocs()
                setSave('Save')

            }).catch((err) => {
                console.log(err)

            })

        }


    };

    function ondownload(filename) {

        fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/filedownload/" + filename).then((res) => {
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

                fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/deletefile/" + fid, {
                    method: "PUT",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(textobj)
                }).then((res) => {
                    //  alert("Data saved")
                    renderAllDocs()

                }).catch((err) => {
                    console.log(err)

                })
            } else {

            }


        });

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
                        <h6>files</h6>
                        <Select
                            className="basic-single"
                            classNamePrefix="select user"
                            isLoading={false}
                            isClearable={true}
                            isSearchable={true}
                            name="files"
                            value={selectedOption}
                            onChange={handleChange}
                            options={alldocslist}
                        />
                        </Form.Group>
                        </div>
                        <span><Button className='btn btn-dark my-2' size="" onClick={Onsharefiles}>Send</Button></span>
                    
                </Card.Body>
            </Card>
            </div>
            <div className="container mx-3 col-lg-6 my-5" style={{ marginleft: '0px' }}>

                <Card>
                    <Card.Header className='card text-center' style={{ backgroundColor: 'black' }}>
                        <h4 style={{ color: 'white' }}>List of Uploaded Files</h4>
                    </Card.Header>
                </Card>

                <Table striped bordered hover size="sm">
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
                                <td>{option.filename}</td>
                                <td>{option.Dateandtime}</td>
                                <td><Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(option.filename)}>Download</Button> </td>
                                <td> <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(option.fid)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </div>
            <div className="container mx-3 col-lg-5 margintopbottom" style={{ marginleft: '0px' }}>
              
            </div>
        </>
    )
}
