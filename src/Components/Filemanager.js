import React, { useState, useEffect} from 'react'
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
    const [alluserlist, setallusers] = useState([])
    const MySwal = withReactContent(Swal)
    const [Save, setSave] = useState('Save')
    const [Send, setSend] = useState('Send')

   const [selectedUser, setSelectedUser] = useState('');
   const url = "https://owcylo27c7.execute-api.us-east-1.amazonaws.com";
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
        
     },[]);// eslint-disable-line react-hooks/exhaustive-deps
    
     useEffect(() => {        
        renderAllDocs()
     },[]);// eslint-disable-line react-hooks/exhaustive-deps

    function renderAllUsers () {
        
          fetch(url+"/userdata").then((res) => {  
              return res.json();
          }).then((resp) => {
              let userobj = {}
              let allusersnames = [];
              let cid = sessionStorage.getItem('username');
              if (resp != null) {
  
                  for (let i = 0; i < resp.length; i++) {
                      if(resp[i]['id']!==cid){
                        userobj['label'] = resp[i]['id']
                        userobj['value'] = resp[i]['id']
                        allusersnames.push(userobj);
                        userobj = {};
                      }
                  }
                  setallusers(allusersnames)
              }else{
                  setallusers(allusersnames)
              }
          })   
      }
    function renderAllDocs() {
        let id = sessionStorage.getItem('username');

        fetch(url+"/alldoc/" + id).then((res) => {
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

    function Onsharefiles() {

        const formData = new FormData();
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');
        const inputField = document.getElementById("sharedoc");

        let sendto = selectedUser.value; //"Admin"//sessionStorage.getItem('username');
        let sendBy = sessionStorage.getItem('username');

        console.log("mydoc",mydoc)


        if (document.getElementById("sharedoc").value === '') {
            MySwal.fire({
                title: <strong>File not found!</strong>,
                html: <i>please choose a file to upload</i>,
                icon: 'warning'
            })
        }else if(selectedUser ===''){
            MySwal.fire({
                title: <strong>User not found!</strong>,
                html: <i>please choose a user to share file</i>,
                icon: 'warning'
            })

        }else{
            setSend('Sending...')
            formData.append(
                "myFile",
                mydoc,
                mydoc.fileName,

            );
            formData.append('username', sendto);
            formData.append('savedatetime', formattedDate);
            formData.append('sendBy',sendBy)

            fetch(url+"/fileupload", {
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

            }).catch((err) => {
                console.log(err)

            })

        }
    }

    function onFileChange(event) {
        debugger
        const inputField = document.getElementById("mydoc");
        const shareFileInputField = document.getElementById("sharedoc");
        let filesize = event.target.files[0].size/1048576;
        if(filesize>1){
            MySwal.fire({
                title: <strong>File size Exceeds!</strong>,
                html: <i>please choose a file of less than 3MB</i>,
                icon: 'warning'
            })
            inputField.value = '';
            shareFileInputField.value = '';
        }else{
            setmydoc(event.target.files[0])
        }       
    }

    function onFileUpload() {
        const formData = new FormData();
        const date = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');
        const inputField = document.getElementById("mydoc");
        let username = sessionStorage.getItem('username');
        let sendBy = ''

        if (document.getElementById("mydoc").value === '') {
            MySwal.fire({
                title: <strong>File not found!</strong>,
                html: <i>please choose a file to upload</i>,
                icon: 'warning'
            })
        }else {
            setSave('Saving...')
            formData.append(
                "myFile",
                mydoc,
                mydoc.fileName,

            );
            formData.append('username', username);
            formData.append('savedatetime', formattedDate);
            formData.append('sendBy',sendBy)

            fetch(url+"/fileupload", {
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

        fetch(url+"/filedownload/" + filename).then((res) => {
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

                fetch(url+"/deletefile/" + fid, {
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
                            <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Browse A File To Share</Form.Label>
                            <Form.Control type="file" id="sharedoc" onChange={onFileChange} />
                        </Form.Group>
                        </div>
                        <span><Button className='btn btn-dark my-2' size="" onClick={Onsharefiles}>{Send}</Button></span>

                    </Card.Body>
                </Card>
            </div>
            <div className="container mx-3 col-lg-6 my-5" style={{ marginleft: '0px' }}>

                <Card>
                    <Card.Header className='card text-center' style={{ backgroundColor: 'black' }}>
                        <h4 style={{ color: 'white' }}>List of Files</h4>
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
                                <td>{option.Dateandtime}{option.sendBy ? <b><br></br>SentBy: {option.sendBy}</b> : ''}</td>
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
