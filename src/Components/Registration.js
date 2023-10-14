import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import emailjs from 'emailjs-com';
import PasswordStrengthBar from 'react-password-strength-bar';
//import { encrypt, decrypt, compare } from 'n-krypta';

const Registration = () => {

    const [id, idchange] = useState("")
    const [name, namechange] = useState("")
    const [phone, phonechange] = useState("")
    const [email, emailchange] = useState("")
    const [address, addresschange] = useState("")
    const [country, countrychange] = useState("india")
    const [gender, genderchange] = useState("male")
    const [showPassword, setShowPassword] = useState(false);
    const [showpassmeter, setshowpassmeter] = useState(false);
    const [newPassword, setnewPassword] = useState('');
    const [showregisterbutton, setshowregisterbutton] = useState(true)
    const [showloadingbutton, setshowloadingbutton] = useState(false)


    const navigate = useNavigate("")
    const MySwal = withReactContent(Swal)
    const form = useRef();
    //   const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com"
    const url = "http://localhost:8000";

    function onchangePassword(e) {
        setnewPassword(e.target.value)
        setshowpassmeter(true)
        if (e.target.value === '') {
            setshowpassmeter(false)
        }
        console.log(newPassword)
    }

    function emailValidation() {
        setshowregisterbutton(false)
        setshowloadingbutton(true)

        if (id === '' || name === '' || email === "" || newPassword === '') {
            MySwal.fire({
                title: <strong>Details Missing!</strong>,
                html: <i>Please Fill all the important Details.</i>,
                icon: 'warning'
            })
            setshowregisterbutton(true)
            setshowloadingbutton(false)
        } else {

            fetch(url + "/userdata").then((res) => {
                return res.json();
            }).then((resp) => {
                var flag = "Email not found"
                let email = document.getElementById('useremail').value
                debugger
                if (resp != null) {
                    for (let i = 0; i < resp.length; i++) {
                        if (resp[i]['email'] === email) {
                            flag = "Email Found"
                            break;
                        }
                    }
                    if (flag === "Email Found") {

                        MySwal.fire({
                            title: <strong>Email is already Registered!</strong>,
                            html: <i>Please Enter other email</i>,
                            icon: 'warning'
                        })
                        setshowregisterbutton(true)
                        setshowloadingbutton(false)

                    } else {
                        addnewUser()
                    }
                } else {
                    console.log(flag)
                    addnewUser()
                }

            })
        }
    }

    function addnewUser() {

        let regobj = {

            "id": id,
            "name": name,
            "password": newPassword,
            "phone": phone,
            "email": email,
            "address": address,
            "country": country,
            "gender": gender
        }
        let verify = document.getElementById("verify");

        if (verify.textContent === "Available") {
            console.log("regobj", regobj)
            var template_params = {
                'to_email': email,
                'fullname': name,
                'password': newPassword,
                'username': id

            };

            emailjs.send('service_ow9fq7m', 'template_e4co5oc', template_params, 'mOAC_5gkWPHi4RVjh')
                .then((result) => {
                    console.log(result.text);
                    fetch(url + "/data", {
                        method: "POST",
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify(regobj)
                    }).then((res) => {

                        MySwal.fire({
                            title: <strong>Good Luck!!</strong>,
                            html: <i>Registration Success,Please SignIn</i>,
                            icon: 'success'
                        })
                        setshowregisterbutton(true)
                        setshowloadingbutton(false)
                        navigate('/')
                    }).catch((err) => {
                        alert("Not Registerd")
                    })

                }, (error) => {
                    console.log(error)
                    MySwal.fire({
                        title: <strong>Invalid Email!!</strong>,
                        html: <i>Please Enter Valid Email</i>,
                        icon: 'warning'
                    })
                    setshowregisterbutton(true)
                    setshowloadingbutton(false)
                });
        } else {
            MySwal.fire({
                title: <strong>Not Verified!!</strong>,
                html: <i>please verify username or try another username.</i>,
                icon: 'warning'
            })
            setshowregisterbutton(true)
            setshowloadingbutton(false)
        }

    }


    function switchverify(e) {
        idchange(e.target.value)
        let myInput = document.getElementById("verify");
        myInput.textContent = "Verify";
        myInput.style.color = "blue";
        myInput.style.fontWeight = "400";
    }


    function handleToVerifyUser() {
        let currentuser = id;
        let myInput = document.getElementById("verify");
        myInput.textContent = "Verifying...";

        fetch(url + "/data/" + currentuser).then((res) => {
            return res.json();
        }).then((resp) => {
            if (resp == null) {
                resp = {}
            }
            if (Object.keys(resp).length === 0) {
                let myInput = document.getElementById("verify");
                myInput.textContent = "Available";
                myInput.style.color = "green";
                myInput.style.fontWeight = "bold";

            } else {
                let myInput = document.getElementById("verify");
                myInput.textContent = "That username is taken .Try another!";
                myInput.style.color = "red";
                myInput.style.fontWeight = "light";
            }
        }).catch((err) => {
            alert(err.message)
        })
    }

    function backtologin() {
        navigate('/')

    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div className='offset-lg-3 col-lg-6'>
                <Card className="card" style={{ boxShadow: '1px 2px 9px #6c757d', marginTop: '40px', marginBottom: '15px' }}>
                    <form ref={form} className='container margintopbottom' >
                        <div className='card'>
                            <div className='card-header'>

                                <h3 className='text-center'>User Registration</h3>
                            </div>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <div className='form-group'>
                                            <label>User Name <span className='errmsg'>*</span></label>
                                            <input value={id} name="username" onChange={switchverify} required className='form-control'></input>
                                            <p style={{ color: 'blue', cursor: 'pointer' }} className="" id="verify" onClick={handleToVerifyUser}>Verify</p>
                                        </div>

                                    </div>
                                    <div className='col-lg-6'>
                                        <div className='form-group'>
                                            <label>Password <span className='errmsg'>*</span></label>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input value={newPassword} name="password" onChange={e => onchangePassword(e)} required type={showPassword ? 'text' : 'password'} className='form-control'></input>
                                                <FontAwesomeIcon style={{ position: 'relative', right: '23px', cursor: 'pointer' }}
                                                    icon={showPassword ? faEyeSlash : faEye}
                                                    className="eye-icon"
                                                    onClick={toggleShowPassword}
                                                />
                                            </div>
                                            {showpassmeter && <PasswordStrengthBar style={{ height: '2px', marginTop: '8px' }} password={newPassword} />}
                                        </div>

                                    </div>
                                    <div className='col-lg-6'>
                                        <div className='form-group'>
                                            <label>Full Name <span className='errmsg'>*</span></label>
                                            <input value={name} name="fullname" onChange={e => namechange(e.target.value)} required type="text" className='form-control'></input>
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className='form-group'>
                                            <label>Email <span className='errmsg'>*</span></label>
                                            <input value={email} type='email' id='useremail' name="to_email" required onChange={e => emailchange(e.target.value)} className='form-control'></input>
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className='form-group'>
                                            <label>PhoneNo <span className='errmsg'></span></label>
                                            <input value={phone} onChange={e => phonechange(e.target.value)} type="number" className='form-control'></input>
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className='form-group'>
                                            <label>Country <span className='errmsg'>*</span></label>
                                            <select className='form-control' value={country} onChange={e => countrychange(e.target.value)}>
                                                <option value="india">India</option>
                                                <option value="usa">USA</option>
                                                <option value="singapore">Singapore</option>
                                                <option value="australia">Australia</option>
                                                <option value="canada">Canada</option>
                                                <option value="united-kingdom">United Kingdom</option>
                                                <option value="germany">Germany</option>
                                                <option value="france">France</option>
                                                <option value="japan">Japan</option>
                                                <option value="china">China</option>
                                                <option value="italy">Italy</option>
                                                <option value="brazil">Brazil</option>
                                                <option value="south-africa">South Africa</option>

                                            </select>
                                        </div>
                                    </div>

                                    <div className='col-lg-12'>
                                        <div className='form-group'>
                                            <label>Address</label>
                                            <textarea className="form-control" value={address} onChange={e => addresschange(e.target.value)}></textarea>
                                        </div>
                                    </div>

                                    <div className='col-lg-6'>
                                        <div className='form-group'>
                                            <label>Gender</label>
                                            <br></br>
                                            <input type="radio" checked={gender === 'male'} onChange={e => genderchange(e.target.value)} name="gender" value='male' className='app-check mx-1'></input>
                                            <label>Male</label>
                                            <input type="radio" checked={gender === 'female'} onChange={e => genderchange(e.target.value)} name="gender" value='female' className='app-check mx-1'></input>
                                            <label>female</label>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className='card-footer'>
                                {showregisterbutton && <button type="button" className='btn btn-dark mx-2' onClick={emailValidation}>Register</button>}
                                {showloadingbutton && <button class="btn btn-dark mx-2" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    &nbsp;Register
                                </button>}
                                <button type="button" className='btn btn-light' onClick={backtologin}>Back</button>
                            </div>

                        </div>

                    </form>
                </Card>
            </div>
        </div>
    )
}


export default Registration;
