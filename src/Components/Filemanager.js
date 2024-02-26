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
import LoadingBar from 'react-top-loading-bar'


export default function Filemanager() {
    // eslint-disable-next-line
    const [mydoc, setmydoc] = useState([]);
    const usenavigate = useNavigate();
    const [OptionsValue, setoptions] = useState([])
    const [AlldocsData, setalldocsdata] = useState([])
    const [AllFiles, setallfiles] = useState([])
    const [historydata, sethistorydata] = useState([])
    const [starreddoc, setstarreddoc] = useState([])
    const [alluserlist, setallusers] = useState([])
    const MySwal = withReactContent(Swal)
    const [Saveloading, setSaveloading] = useState(true)
    const [showfiles, setShowFiles] = useState(true)
    const [showfilesHistory, setShowHistory] = useState(false)
    const [Send, setSend] = useState('Send')
    const [SearchQuery, setSearchQuery] = useState('')
    const [progress, setProgress] = useState(0)
    const[loaddata,setloaddata] = useState(true)

    const [selectedUser, setSelectedUser] = useState('');
    const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com";
    //const url = "http://localhost:8000";


    const handleChangeUser = (selectedUser) => {
        setSelectedUser(selectedUser);
        console.log(Saveloading)
        
    };

    useEffect(() => {

        var username = sessionStorage.getItem('username');
        if (username === '' || username === null) {
            usenavigate('/');
        }
        console.log("inside useeffect")
        async function fetchalldata() {

            await renderAllDocs()
            await renderAllUsers()
            await historyOfSharedDocs()
            setloaddata(false)
        }
        fetchalldata();

    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    
    function Showfiles() {
        setShowFiles(true)
        setShowHistory(false)
        setoptions(AlldocsData)

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
        setoptions(historydata)
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


    function showStarredDocs() {

        setShowFiles(true)
        setShowHistory(false)
        setoptions(starreddoc)
        console.log("starreddoc", starreddoc)

        var starredbtnElement = document.getElementById('starred');
        starredbtnElement.style.backgroundColor = '#28a745'
        starredbtnElement.style.color = 'white'

        var historybtnElement = document.getElementById('history');
        historybtnElement.style.backgroundColor = ''
        historybtnElement.style.color = ''

        var filesbtnElement = document.getElementById('files');
        filesbtnElement.style.backgroundColor = ''
        filesbtnElement.style.color = ''

    }

    async function renderAllUsers() {
        try {
            let response = await fetch(url + "/userdata")
            debugger
            if (response.ok === true) {
                let resp = await response.json()
                if (resp.length !== 0) {
                    let cid = sessionStorage.getItem('username');
                    let filtereddata = resp.filter((res) => { return res.id !== cid }).map((data) => {
                        return {
                            'label': data.id,
                            'value': data.id
                        }
                    })
                    setallusers(filtereddata)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    async function renderAllDocs() {
        let id = sessionStorage.getItem('username');

        try {
            let response = await fetch(url + "/alldoc/" + id)
            if (response.ok) {
                let resp = await response.json()
                if (resp.length !== 0) {
                    let myobj = {}
                    let options = [];
                    let docobj = {};
                    let alldocnames = [];
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
                    let j = 0
                    let data = options.filter((opt) => { return opt.isstarred }).map((data) => {
                        return {
                            ...data,
                            'id': ++j,

                        }
                    })
                    console.log(options)
                    setstarreddoc(sortdatabydate(data))
                    setoptions(sortdatabydate(options))
                    setalldocsdata(options)
                    setallfiles(options)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    function sortdatabydate(data){
        return data.sort((a,b)=>
        new Date(b.Dateandtime) - new Date(a.Dateandtime)
        )

    }

    async function historyOfSharedDocs() {

        let id = sessionStorage.getItem('username');
        try {
            let response = await fetch(url + "/allhistorydoc/" + id)
            if (response.ok) {
                let resp = await response.json()
                if (resp.length !== 0) {
                    let myobj = {}
                    let options = [];
                    let docobj = {};
                    let alldocnames = [];
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
                    sethistorydata(options)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function Onsharefiles() {
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
            formData.append("myFile", mydoc, mydoc.name,);
            formData.append('username', sendto);
            formData.append('savedatetime', formattedDate);
            formData.append('sendBy', sendBy)

            let response = await fetch(url + "/fileupload", { method: "POST", body: formData })
            if (response.ok) {
                MySwal.fire({
                    title: <strong>Sent!</strong>,
                    html: <i>Data Shared Successfully!</i>,
                    icon: 'success'
                })
                inputField.value = '';
                setSelectedUser('');
                setSend('Send')
                historyOfSharedDocs();
            }
        }
    }

    function onFileChange(event) {
        // eslint-disable-next-line
        let filesize = event.target.files[0].size / 1048576;

        if (filesize > 50) {
            MySwal.fire({
                title: <strong>File size Exceeds!</strong>,
                html: <i>please choose a file of less than 50MB</i>,
                icon: 'warning'
            })
            const inputField = document.getElementById("mydoc");
            const shareFileInputField = document.getElementById("sharedoc");
            inputField.value = '';
            shareFileInputField.value = '';
        } else {
            setmydoc(event.target.files[0])
            console.log("mydoc", mydoc)
        }

    }

    async function onFileUpload() {
        if (document.getElementById("mydoc").value === '') {
            MySwal.fire({
                title: <strong>File not found!</strong>,
                html: <i>please choose a file to upload</i>,
                icon: 'warning'
            })
        } else {
            setSaveloading(false)
            const formData = new FormData();
            const date = new Date();
            const options = { timeZone: 'Asia/Kolkata' };
            const formattedDate = date.toLocaleString('en-IN', { ...options, dateStyle: 'medium', timeStyle: 'medium' }).replace(/\//g, '-');
            const inputField = document.getElementById("mydoc");
            let username = sessionStorage.getItem('username');
            let sendBy = ''
            formData.append(
                "myFile",
                mydoc,
                mydoc.name,

            );
            formData.append('username', username);
            formData.append('savedatetime', formattedDate);
            formData.append('sendBy', sendBy)
            try {
                let response = await fetch(url + "/fileupload", { method: "POST", body: formData })
                if (response.ok) {
                    console.log("Data Upload Successfully")
                    inputField.value = '';
                    await renderAllDocs()
                    setSaveloading(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

  async  function ondownload(filename) {
    setProgress(progress + 10)
       try{
            let response = await fetch(url + "/filedownload/" + filename)
            if(response.ok){
                let blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        }catch(error){
            console.log(error)
        }
       setProgress(100)
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
            }


        });

    }

    async function toggleStarred(fid, status) {
        var option = OptionsValue;
        // eslint-disable-next-line
        let element = document.getElementById(fid)
        element.setAttribute('color', status ? 'grey' : 'gold');
        let data = option.map((data) => { return  (data.fid === fid) ? { ...data, 'isstarred': !data.isstarred } : { ...data } })
        setoptions(data)
        let username = sessionStorage.getItem('username');
        let textobj = {
            "username": username,
            "isstarred": !status
        }
        try {
            let response = await fetch(url + "/starredfile/" + fid, {
                method: "PUT", headers: { 'content-type': 'application/json' },
                body: JSON.stringify(textobj)
            })
            if (response.ok) {
                renderAllDocs()
            }
        } catch (error) {
            console.log(error)
        }
    }

    function filterFiles(event) {
        const searchText = event.target.value;
        setSearchQuery(searchText);
        if (searchText !== "") {
            const filteredFiles = AllFiles.filter(file =>
                file.filename.toLowerCase().includes(searchText.toLowerCase())
            );
            setoptions(filteredFiles)
        } else {
            setoptions(AllFiles)
        }

    }

    return (
        <>
            <div className="container mx-3 col-lg-5 my-5" style={{ marginleft: '0px' }}>
            <LoadingBar color="#FF3333" height='5' progress={progress} onLoaderFinished={() => setProgress(0)} />
                <Card>
                    <Card.Header className='card text-center' style={{ backgroundColor: 'black', color: 'white' }}>
                        <h4> File Upload Section</h4>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Browse A File To Upload</Form.Label>
                            <input className='form-control' type="file" id="mydoc" onChange={onFileChange} />
                            {Saveloading ? <Button className='btn btn-dark my-2' size="" onClick={onFileUpload}>
                            Save</Button>:
                            <Button class="btn btn-dark my-2" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            &nbsp;Save
                        </Button>}
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
                                <input className='form-control' type="file" id="sharedoc" onChange={onFileChange} />
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
                            <Button className='btn my-2' variant="outline-success" id='starred' onClick={showStarredDocs}>Starred</Button>
                            <Button className='btn my-2 ml-2' variant="outline-success" id='files' style={{ backgroundColor: '#28a745', color: 'white' }} onClick={Showfiles}>Files</Button>
                            <Button className='btn my-2 ml-2 mr-2' variant="outline-success" id='history' onClick={ShowfilesHistory}>History</Button>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'right', width: '25%' }}>
                            <input className="form-control" variant="outline-success" value={SearchQuery} type="search" onChange={filterFiles} placeholder="Search" aria-label="Search" />

                        </div>
                    </Card.Header>
                </Card>
                
                {showfiles &&(
                    
                    
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
                            {OptionsValue.length==0?<p style={{display:'flex'}}>No files to show</p>:
                         <tbody>
                        {OptionsValue.map(option => (
                                    <tr key={option.id}>
                                         <td></td>
                                        <td>{option.filename}&nbsp;&nbsp; <FontAwesomeIcon icon={faStar} id={option.fid} onClick={() => toggleStarred(option.fid, option.isstarred)} style={{ cursor: 'pointer', }} color={option.isstarred ? 'gold' : 'grey'} /></td>
                                        <td>{option.Dateandtime}{option.sendBy ? <b><br></br>SentBy: {option.sendBy}</b> : ''}</td>
                                        <td><Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(option.filename)}>Download</Button> </td>
                                        <td> <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(option.fid)} /></td>
                                    </tr>
                                ))}  
                            </tbody>}
                          
            
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
                            {historydata.length==0?<p style={{display:'flex'}}>No files to show</p>:
                            <tbody>
                                {historydata.map(option => (
                                    <tr key={option.id}>
                                        <td></td>
                                        <td>{option.filename}</td>
                                        <td>{option.Dateandtime}</td>
                                        <td><Button className='btn my-2' variant="outline-success" size="sm" onClick={() => ondownload(option.filename)}>Download</Button> </td>
                                        <td> <FontAwesomeIcon icon={faTrash} className="ml-1 btn" style={{ cursor: 'pointer' }} onClick={() => Deletefile(option.fid)} /></td>
                                        <td><b>{option.sendTo}</b></td>
                                    </tr>
                                ))}
                               
                            </tbody>}
                        </Table>
                    </div>
                )}
                 {loaddata&&     <div class="d-flex justify-content-center">
                     <div class="spinner-border" role="status">
                       <span class="sr-only">Loading...</span>
                     </div>
                     </div>}

            </div>
            <div className="container mx-3 col-lg-6 margintopbottom" style={{ marginleft: '0px' }}>
            </div>
        </>
    )
}
