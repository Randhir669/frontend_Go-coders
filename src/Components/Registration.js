import React from 'react'
import { useState} from 'react'
import { useNavigate } from 'react-router-dom'

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
    const [email, emailchange] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showpassmeter, setshowpassmeter] = useState(false);
    const [newPassword, setnewPassword] = useState('');
    const [showregisterbutton, setshowregisterbutton] = useState(true)
    const [showloadingbutton, setshowloadingbutton] = useState(false)


    const navigate = useNavigate("")
    const MySwal = withReactContent(Swal)
     const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com"
  //  const url = "http://localhost:8000";

    function onchangePassword(e) {
        setnewPassword(e.target.value)
        setshowpassmeter(true)
        if (e.target.value === '') {
            setshowpassmeter(false)
        }
        console.log(newPassword)
    }


    async function addnewuser() {
        setshowregisterbutton(false)
        setshowloadingbutton(true)

        let response = await validateallfield()
        if (response) {
            if (await emailVerification()) {

                if (await handleToVerifyUser()) {
                    if (await addUserfun()) {
                        triggermail()
                    }

                }
            }
        }


        setshowregisterbutton(true)
        setshowloadingbutton(false)
    }

    function validateallfield() {

        if (id === '' || name === '' || email === "" || newPassword === '') {
            MySwal.fire({
                title: <strong>Details Missing!</strong>,
                html: <i>Please Fill all the important Details.</i>,
                icon: 'warning'
            })
            setshowregisterbutton(true)
            setshowloadingbutton(false)
            return false
        } else {
            return true
        }

    }

    async function emailVerification() {
        try {
            let response = await fetch(url + "/userdata")
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            let resp = await response.json()
            let filtereddata = resp.filter((res) => res.email === email)
            if (filtereddata.length !== 0) {
                MySwal.fire({
                    title: <strong>Email is already Registered!</strong>,
                    html: <i>Please Enter other email</i>,
                    icon: 'warning'
                })
                return false
            }
            return true

        } catch (error) {
            console.log(error)
        }
    }

    async function addUserfun() {
        let regobj = {
            "id": id,
            "name": name,
            "password": newPassword,
            "phone": "12345678",
            "email": email,
            "address": "addresss",
            "country": "country",
            "gender": "Male"
        }
        try {
            let response = await fetch(url + "/data", {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(regobj)
            })
            if (response.ok) {
                MySwal.fire({
                    title: <strong>Good Luck!!</strong>,
                    html: <i>Registration Success Check Mail,Please SignIn</i>,
                    icon: 'success'
                })
                return true
            }

        } catch (error) {
            MySwal.fire({
                title: <strong>SignUp Failed!!</strong>,
                html: <i>Please Try Again.</i>,
                icon: 'warning'
            })
            return false

        }
    }

    async function triggermail() {
        var template_params = {
            'to_email': email,
            'fullname': name,
            'password': newPassword,
            'username': id
        };
        try {
            let response = await emailjs.send('service_ow9fq7m', 'template_e4co5oc', template_params, 'mOAC_5gkWPHi4RVjh')
            if (response.ok) {
                console.log("Mail sent")
                backtologin()
            }
        } catch (error) {
            console.log(error)
        }

    }

    function switchverify(e) {
        idchange(e.target.value)
        let myInput = document.getElementById("verify");
        myInput.textContent = "";
        myInput.style.color = "";

    }


    async function handleToVerifyUser() {
        let currentuser = id;

        let response = await fetch(url + "/data/" + currentuser)

        if (response.ok) {

            let resp = await response.json()
            if (resp === null) {
                let myInput = document.getElementById("verify");
                myInput.textContent = "Available";
                myInput.style.color = "green";
                myInput.style.fontWeight = "bold";
                return true

            } else {
                let myInput = document.getElementById("verify");
                myInput.textContent = "That username is taken .Try another!";
                myInput.style.color = "red";
                myInput.style.fontWeight = "light";
                return false

            }


        }

    }

    function backtologin() {
        navigate('/')

    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div className='offset-lg-4 col-lg-4 margintopbottomsignup' >
                <div className='card signupshadow ' >
                    <div className='card-header'>
                        <h3 className="text-center">Sign UP</h3>
                    </div>
                    <div className='card-body'>
                        <div className=' row'>
                            <div className='col-lg-6'>
                                <label>User Name <span className='errmsg'>*</span></label>
                                <input value={id} name="username" onChange={switchverify} required className='form-control'></input>
                                <p style={{ color: 'blue', cursor: 'pointer' }} className="" id="verify"></p>
                            </div>
                            <div className='col-lg-6'>
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
                        <div className='row'>
                            <div className='col-lg-6'>
                                <label>Full Name <span className='errmsg'>*</span></label>
                                <input value={name} name="fullname" onChange={e => namechange(e.target.value)} required type="text" className='form-control'></input>
                            </div>
                            <div className='col-lg-6'>
                                <label>Email <span className='errmsg'>*</span></label>
                                <input value={email} type='email' id='useremail' name="to_email" required onChange={e => emailchange(e.target.value)} className='form-control'></input>
                            </div>
                        </div>
                    </div>
                    <div className='card-footer'>
                        {showregisterbutton && <button type="button" className='btn btn-dark mx-2' onClick={addnewuser}>SignUp</button>}
                        {showloadingbutton && <button class="btn btn-dark mx-2" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            &nbsp;SignUp
                        </button>}
                        <button type="button" className='btn btn-light' onClick={backtologin}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Registration;
