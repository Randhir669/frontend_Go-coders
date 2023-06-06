import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import Card from 'react-bootstrap/Card';
import withReactContent from 'sweetalert2-react-content'




export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showlabel, setshowlabel] = useState(true);
    const [hidelabel, sethidelabel] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showpassword, setshowpassword] = useState('password');
    const MySwal = withReactContent(Swal)
    const usenavigate = useNavigate();

    const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com/"
    //const url = "http://localhost:8000";

    useEffect(() => {
        sessionStorage.clear();

    }, []);


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

    function ShowPassword(){
     
        setshowpassword('text')
        setshowlabel(false)
        sethidelabel(true)

    }
    function hidePassword(){
     
        setshowpassword('password')
        setshowlabel(true)
        sethidelabel(false)

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
            console.log(password)
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
                            <div className="form-group mt-3 " style={{height:'40px'}}>
                                <input type="text" required className="form-control" onChange={goToOnchangeUsername}  value={username} />
                                <label className="form-control-placeholder" >Username</label>

                            </div>              
                            <div className="form-group ">
                             {showlabel && <label className="showpass" for = "right-label" style = {{color:'#26e1ead4'}} onClick={ShowPassword}>Show</label>}
                             {hidelabel && <label className="showpass" for = "right-label" style = {{color:'#26e1ead4'}} onClick={hidePassword}>Hide</label>}
                                <input id="password-field" required type={showpassword} className="form-control"  value={password} onChange={goToOnchangePassword} />

                                <label className="form-control-placeholder">Password</label>

                                <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"></span>
                            </div>
                            <div className="form-group ">
                                <button type="submit" disabled={isButtonDisabled} className="form-control btn btn-dark rounded submit px-3" onClick={proceedlogin}>
                                    {isSubmitting ? <Spinner /> : 'Sign In'}</button>
                            </div>

                        </form>
                        <div className="card-footer text-center">
                            <a className='btn btn-light' href='/'>Forget Password</a>
                            <button type="submit" className='btn mx-2' onClick={signup} style={{ color: 'blue' }}>Sign UP</button>
                        </div>

                    </div>
                </form>
            </Card>
        </div>
    );

}




