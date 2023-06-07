import React, { useRef, useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import PasswordStrengthBar from 'react-password-strength-bar';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


export default function ResetPassword() {

    const [confirmPassword, setconfirmPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [showpasserror, setshowpasserror] = useState(false);
    const [showpassmeter, setshowpassmeter] = useState(false);
    const [showsubmit, setshowsubmit] = useState(true);
    const [currentusername, setcurrentusername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfrmPassword, setShowConfrmPassword] = useState(false);
    const [showsubmitbutton, setshowsubmitbutton] = useState(true)
    const [showloadingbutton, setshowloadingbutton] = useState(false)
    const MySwal = withReactContent(Swal);




    const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com"
   // const url = "http://localhost:8000";
    const form = useRef();
    const navigate = useNavigate('');

    useEffect(() => {

        var url = window.location.href;
        var urlParams = new URLSearchParams(new URL(url).search);
        var email = urlParams.get('email');
        var user = urlParams.get('user');
        console.log('Email:', email);
        console.log('user:', user);
        setcurrentusername(user);

    }, []);



    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    function toggleShowPasswordConfrm(e) {
        setShowConfrmPassword(!showConfrmPassword);
    }

    function onchangeNewPassword(e) {
        setnewPassword(e.target.value)
        setshowpassmeter(true)
        if (e.target.value === '') {
            setshowpassmeter(false)
        }
        console.log(newPassword)
    }


    function onchangeConfirmPassword(e) {

        setconfirmPassword(e.target.value)

        let confirmpassword = document.getElementById('confrmpass').value
        let newpassword = document.getElementById('newpass').value

        if (confirmpassword !== newpassword) {
            setshowpasserror(true)
            setshowsubmit(true)
        }

        if (confirmpassword === newpassword) {
            setshowpasserror(false)
            setshowsubmit(false)
        }
    }

    function passValidation() {

        let confirmpassword = document.getElementById('confrmpass').value
        let newpassword = document.getElementById('newpass').value

        if (confirmpassword === '' || newpassword === '') {
            alert("Please Provide Passwords")
            setshowsubmit(true)
            setshowsubmitbutton(true)
            setshowloadingbutton(false)
            return false;
        }

        return true;

    }

    function updateuser() {
        setshowsubmitbutton(false)
        setshowloadingbutton(true)

        if (passValidation()) {

            let username = currentusername;
            let resetpassobj = {
                "password": confirmPassword,
            }

            fetch(url + "/resetpassword/" + username, {
                method: "PUT",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(resetpassobj)
            }).then((res) => {

                MySwal.fire({
                    title: <strong>Good Luck!!</strong>,
                    html: <i>Password Modified Successfully!</i>,
                    icon: 'success'
                })
                setshowsubmitbutton(true)
                setshowloadingbutton(false)

                navigate('/')
            }).catch((err) => {
                console.log(err)
                setshowsubmitbutton(true)
                setshowloadingbutton(false)

            })
        }

    }

    function backtologin() {
        navigate('/')

    }

    return (
        <div className='offset-lg-4 col-lg-4'>
            <Card className="card" style={{ boxShadow: '1px 2px 9px #6c757d', marginTop: '100px', marginBottom: '15px' }}>
                <form className='container margintopbottom'>
                    <div className='card'>
                        <div className="card-header">
                            <div className="w-100">
                                <h3 className="text-center ">Reset Password</h3>
                                <p className="text-center">Create a new password for your account </p>
                            </div>

                        </div>
                        <form ref={form} className="signin-form card-body">
                            <div className="form-group mt-3 " >
                                <label className="form-control-placeholder" >New Password</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input required type={showPassword ? 'text' : 'password'} id='newpass' className="form-control" onChange={e => onchangeNewPassword(e)} />
                                    <FontAwesomeIcon style={{ position: 'relative', right: '23px', cursor: 'pointer' }}
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="eye-icon"
                                        onClick={toggleShowPassword}
                                    />

                                </div>
                                {showpassmeter && <PasswordStrengthBar style={{ height: '2px', marginTop: '8px' }} password={newPassword} />}
                            </div>
                            <div className="form-group mt-3 " >
                                <label className="form-control-placeholder" >Confirm Password</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input required type={showConfrmPassword ? 'text' : 'password'} id='confrmpass' className="form-control" onChange={e => onchangeConfirmPassword(e)} />
                                    <FontAwesomeIcon style={{ position: 'relative', right: '23px', cursor: 'pointer' }} icon={showConfrmPassword ? faEyeSlash : faEye} className="eye-icon" onClick={toggleShowPasswordConfrm} />
                                </div>
                                {showpasserror && <div style={{ display: 'flex', alignItems: 'center' }}> <FontAwesomeIcon icon={faCircleInfo} size="sm" style={{ color: "#5b85ce", }} /> &nbsp;<p style={{ color: 'red', margin: '0' }}>Passwords are not identical</p> </div>}

                            </div>
                            <div className="form-group ">
                                {showsubmitbutton && <button type="button" disabled={showsubmit} className="form-control btn btn-dark rounded submit px-3" onClick={updateuser}>
                                    Submit</button>}
                                {showloadingbutton && <button class="form-control btn btn-dark rounded submit px-3" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    &nbsp;Submit
                                </button>}

                            </div>
                            <div className="form-group ">
                                <button type="button" onClick={backtologin} className="form-control btn rounded submit px-3 btn-light" >
                                    Cancel</button>
                            </div>
                        </form>
                    </div>
                </form>
            </Card>
        </div>

    );
}
