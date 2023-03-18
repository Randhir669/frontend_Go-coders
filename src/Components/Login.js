import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MySwal = withReactContent(Swal)
    const usenavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

      function forget() {
          usenavigate('/Forget')
      }

    function goToOnchangeUsername(event) {
        setUsername(event.target.value);
    }
    function goToOnchangePassword(event) {
        setPassword(event.target.value);
    }

    function Spinner() {
        return (
            /*  <div className="spinner-border" style={{ width: '3rem', height: '3rem',color:'red'}} role="status">
                <span className="sr-only">Loading...</span>
              </div>*/
        
                <p>Sign In....</p>

            
        );
    }

    function signup(params) {
        // href="Registration"
        usenavigate('/Registration')
    }

    const proceedlogin = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        fetch("http://localhost:3000/user/" + username).then((res) => {
            return res.json();
        }).then((resp) => {
            if (Object.keys(resp).length === 0) {
                MySwal.fire({
                    title: <strong>UserName Not Exist</strong>,
                    html: <i>please signup as a new user</i>,
                    icon: 'warning'
                })
                setIsSubmitting(false);
                //toast.warning("Please Enter valid userName")
            } else {
                if (resp.password === password) {
                    //   alert("SignIn Success")
                    sessionStorage.setItem('name', resp.name)
                    sessionStorage.setItem('username', username)
                    setIsSubmitting(false);
                    usenavigate('/TextEditor')

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
        <div className='row'>
            <div className="offset-lg-4 col-lg-4 card " style={{ marginTop: '100px' }}>
                <div className="card-header">
                    <div className="w-100">
                        <h3 className="mb-4 text-center ">Sign In</h3>
                    </div>

                </div>
                <form onSubmit={proceedlogin} className="signin-form card-body">
                    <div className="form-group mt-3 ">
                        <input type="text" required className="form-control" onChange={goToOnchangeUsername} value={username} />
                        <label className="form-control-placeholder" >Username</label>
                    </div>
                    <div className="form-group ">
                        <input id="password-field" required type="password" className="form-control" value={password} onChange={goToOnchangePassword} />
                        <label className="form-control-placeholder">Password</label>
                        <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"></span>
                    </div>
                    <div className="form-group ">
                        <button type="submit" className="form-control btn btn-dark rounded submit px-3" >
                            {isSubmitting ? <Spinner /> : 'Sign In'}</button>
                    </div>

                </form>
                <div className="card-footer ">
                    <p className="text-center forget-password" onClick={forget} style={{ cursor: 'pointer' }}>Forget Password</p>
                    <p className="text-center" style={{ cursor: 'pointer' }} ><button type="submit" className="form-control btn btn-light rounded submit px-1 col-lg-2" onClick={signup} style={{ color: 'blue' }}>Sign UP</button></p>

                </div>


            </div>
        </div>
    );

}




