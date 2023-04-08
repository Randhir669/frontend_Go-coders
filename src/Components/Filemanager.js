import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom'


export default function Filemanager() {

    const [mydoc, setmydoc] = useState('');
    const usenavigate = useNavigate();
    const [OptionsValue, setoptions] = useState([])

    useEffect(() => {

        var username = sessionStorage.getItem('username');
        if (username === '' || username === null) {
            usenavigate('/');
        }
        renderAllDocs();
    }, []);

    function renderAllDocs() {
        let id = sessionStorage.getItem('username');
    
          fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/alldoc/" + id).then((res) => {
              return res.json();
          }).then((resp) => {
            console.log("resp",resp)
            let myobj = {}
            let options = [];
              if (resp != null) {
                
                  for (let i = 0; i < resp.length; i++) {
                       
                    myobj['id'] = i+1
                    myobj['filename'] = resp[i]['filename']
                    myobj['Dateandtime'] = resp[i]['savedatetime']
                   
                    options.push(myobj);
                    myobj = {};
                  }
                  setoptions(options)
                  
              } else {
                setoptions(options)
              }
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
        // Update the formData object 
        formData.append(
            "myFile",
            mydoc,
            mydoc.fileName,
            
        );
        formData.append('username',username);
        formData.append('savedatetime',formattedDate);
      //  const file = formData.get("myFile");
    
        fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/fileupload", {
            method: "POST",
            body: formData
        }).then((res) => {
            console.log("Data Upload Successfully")
            inputField.value = '';
            renderAllDocs()

        }).catch((err) => {
            console.log(err)

        })
    };

    function ondownload(filename) {

        fetch("https://d85cc0uyae.execute-api.us-east-1.amazonaws.com/filedownload/" + filename).then((res) => {
           return res.blob();
        }).then(blob => {
            // create a temporary URL to the blob
            console.log(blob)
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
                            <span><Button className='btn btn-dark my-2' size="" onClick={onFileUpload}>Save</Button></span>
                        </Form.Group>

                    </Card.Body>
                </Card>
            </div>
            <div className="container mx-3 col-lg-5 my-5" style={{ marginleft: '0px' }}>

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
                            <th>Downloads</th>
                        </tr>
                    </thead>
                    <tbody>
                        {OptionsValue.map(option => (
                            <tr key={option.id}>
                                <td>{option.id}</td>
                                <td>{option.filename}</td>
                                <td>{option.Dateandtime}</td>
                                <td><Button className='btn btn-dark my-2' size="sm" onClick={() => ondownload(option.filename)}>Download</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </div>

        </>
    )
}
