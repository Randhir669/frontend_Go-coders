import React, { useState,useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'








export default function Login() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const MySwal = withReactContent(Swal)
    const usenavigate = useNavigate();

    useEffect(()=>{
        sessionStorage.clear();
       }, []);

    function goToOnchangeUsername(event) {
        setUsername(event.target.value);
    }
    function goToOnchangePassword(event) {
        setPassword(event.target.value);
    }

    function signup(params) {
       // href="Registration"
        usenavigate('/Registration')
    }

    const proceedlogin = (e) => {
        e.preventDefault();
        console.log(username);
        console.log(password);
        fetch("http://localhost:3000/user/" + username).then((res) => {
            return res.json();
        }).then((resp) => {
            console.log(resp)
            if (Object.keys(resp).length === 0) {
                MySwal.fire({
                    title: <strong>UserName Not Exist</strong>,
                    html: <i>please signup as a new user</i>,
                    icon: 'warning'
                  })
                //toast.warning("Please Enter valid userName")
            } else {
                if (resp.password === password) {
                 //   alert("SignIn Success")
                    sessionStorage.setItem('username',username)
                    usenavigate('/TextEditor')
                }
                else {
                  //  alert("")
                    MySwal.fire({
                        title: <strong>Wrong Credentials</strong>,
                        html: <i>Please Enter valid credentials</i>,
                        icon: 'warning'
                      })
                }
            }
        }).catch((err) => {
            alert(err.message)
        })

    }

    return (
        <div className='row'>
            <div className="offset-lg-3 col-lg-6 card " style={{ marginTop: '100px' }}>
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
                        <button type="submit" className="form-control btn btn-dark rounded submit px-3" >Sign In</button>

                    </div>


                </form>
                <p className="text-center card-footer ">Not a member?<a data-toggle="tab" style = {{color:'blue',cursor: 'pointer'} } onmouseover = " "  onClick = {signup}>Sign Up</a></p>


            </div>
        </div>
    );

}




