import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card';
import withReactContent from 'sweetalert2-react-content'
import {faEyeSlash, faEye} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {auth,provider} from './Firebase';
import { signInWithPopup } from 'firebase/auth';
import GoogleButton from 'react-google-button';




export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const MySwal = withReactContent(Swal)
    const usenavigate = useNavigate();

    const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com"
   // const url = "http://localhost:8000";

    useEffect(() => {
        sessionStorage.clear();

    }, []);

    function googleauth(){

        signInWithPopup(auth,provider).then((data)=>{

            sessionStorage.setItem('username', data.user.email)
          
            usenavigate('/Filemanager')

        })
    }


    function goToOnchangeUsername(event) {
        setUsername(event.target.value);

        if(username.length!== 0 && password.length!== 0){

            setIsButtonDisabled(false)
        }else{
            setIsButtonDisabled(true)
        }
    }

    function goToOnchangePassword(event) {
        setPassword(event.target.value);
    
        if(username.length!== 0 && password.length!==0){

            setIsButtonDisabled(false)
        }else{
            setIsButtonDisabled(true)
        }
    }

    function Spinner() {
        return (
            <p>Sign In....</p>
        );
    }

    function signup(params) {
        // href="Registration"
        usenavigate('/Registration')
    }
     
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    function forgetpassword(params) {
        // href="Registration"
        usenavigate('/Forget')
    }

    const proceedlogin = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        fetch(url+"/data/" + username).then((res) => {
            return res.json();
        }).then((resp) => {
            // console.log(resp[0].password)
            if(resp==null){
                resp = {}
            }
            if (Object.keys(resp).length === 0|| resp === null) {
                MySwal.fire({
                    title: <strong>UserName Not Exist</strong>,
                    html: <i>please signup as a new user</i>,
                    icon: 'warning'
                })
                setIsSubmitting(false);
                //toast.warning("Please Enter valid userName")
            } else {
                if (resp[0].password === password) {
                    //   alert("SignIn Success")
                    sessionStorage.setItem('name', resp.name)
                    sessionStorage.setItem('username', username)
                    sessionStorage.setItem('email', resp[0].email)
                    setIsSubmitting(false);
                    usenavigate('/Filemanager')

                }
                else {
                    //  alert("")
                    MySwal.fire({
                        title: <strong>Wrong Credentials</strong>,
                        html: <i>Please Enter valid credentials</i>,
                        icon: 'warning'
                    })
                    setIsSubmitting(false);
                }
            }
        }).catch((err) => {
            alert(err.message)
            setIsSubmitting(false);
        })

    }

    return (
        <div className='offset-lg-4 col-lg-4'>

            <Card className="card" style={{ boxShadow: '1px 2px 9px #6c757d', marginTop: '100px',marginBottom:'15px'}}>
                <form   className='container margintopbottom'>
                    <div className='card'>
                        <div className="card-header">
                            <div className="w-100">
                                <h3 className="text-center ">Sign In</h3>
                            </div>

                        </div>
                        <form onSubmit={proceedlogin} className="signin-form card-body">
                            <div className="form-group mt-3 " style={{height:''}}>
                                <label className="form-control-placeholder" >Username</label>
                                <input type="text" style = {{width: '99%'}} required className="form-control" onChange={goToOnchangeUsername}  value={username} />
                                

                            </div>              
                            <div className="form-group ">
                            <label className="form-control-placeholder">Password</label>
                            <div className = "input-group-append" style={{ display: 'flex', alignItems: 'center',width: '104%' }}>
                             <input id="password-field" required type={showPassword ? 'text':'password'} className="form-control"  value={password} onChange={goToOnchangePassword} />
                              <FontAwesomeIcon style = {{position: 'relative' , right: '23px', cursor:'pointer'}}
                              icon={showPassword ? faEyeSlash : faEye}
                              className="eye-icon"
                              onClick={toggleShowPassword}
                            />
                            </div>
                              
                            </div>
                            <div className="form-group ">
                                <button type="submit" disabled={isButtonDisabled} className="form-control btn btn-dark rounded submit px-3" onClick={proceedlogin}>
                                    {isSubmitting ? <Spinner /> : 'Sign In'}</button>
                            </div>

                        </form>
                        <div className="card-footer text-center">
                            <button type = "button"  className='btn btn-light' onClick={forgetpassword}>Forget Password</button>
                            <button type="submit" className='btn mx-2' onClick={signup} style={{ color: 'blue' }}>Sign UP</button>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                            <GoogleButton classname="px-3 googlebutton" type = 'light' onClick={googleauth}></GoogleButton>
                         </div>
                        </div>

                    </div>
                </form>
            </Card>
        </div>
    );

}




