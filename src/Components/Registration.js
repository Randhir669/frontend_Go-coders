import React from 'react'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
//import { toast } from 'react-toastify'
//import { cloneElement } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


    const Registration = () => {

    const[id,idchange] = useState("")
    const[name,namechange] = useState("")
    const[password,passwordchange] = useState("")
    const[phone,phonechange] = useState("")
    const[email,emailchange] = useState("")
    const[address,addresschange] = useState("")
    const[country,countrychange] = useState("india")
    const[gender,genderchange] = useState("male")


    const navigate = useNavigate("")
    const MySwal = withReactContent(Swal)

   function handletosubmit(e) {

     e.preventDefault();

     let regobj = {id,name,password,phone,email,address,country,gender}
     console.log(regobj)

     fetch ("http://localhost:3000/user",{
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify(regobj)
     }).then((res)=>{
         
          MySwal.fire({
            title: <strong>Good Luck!!</strong>,
            html: <i>Registration Success,Please SignIn</i>,
            icon: 'success'
          })
        navigate('/')
      //  toast.success('Registered Successfully')
     }).catch((err)=>{
        alert("Not Registerd")
       // toast.error('Failed :',+err.message)
     })
    
   }

    return (
        <div>
            <div className='offset-lg-3 col-lg-6'>
                <form className='container margintop' onSubmit={handletosubmit}>
                    <div className='card'>
                        <div className='card-header'>
                            
                             <h3 className='text-center'>User Registration</h3>
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label>User Name <span className='errmsg'>*</span></label>
                                        <input value={id} onChange ={e=>idchange(e.target.value)}  required className='form-control'></input>
                                    </div>

                                </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label>Password <span className='errmsg'>*</span></label>
                                        <input value = {password} onChange={e=>passwordchange(e.target.value)} required type="password" className='form-control'></input>
                                    </div>

                                </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label>Full Name <span className='errmsg'>*</span></label>
                                        <input value = {name} onChange={e=>namechange(e.target.value)} className='form-control'></input>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label>Email <span className='errmsg'>*</span></label>
                                        <input value = {email} onChange={e=>emailchange(e.target.value)} className='form-control'></input>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label>PhoneNo <span className='errmsg'>*</span></label>
                                        <input value = {phone} onChange={e=>phonechange(e.target.value)} type="number" className='form-control'></input>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label>Country <span className='errmsg'>*</span></label>
                                        <select className='form-control' value = {country} onChange={e=>countrychange(e.target.value)}>
                                            <option value="india">India</option>
                                            <option value="usa">USA</option>
                                            <option value="singapore">Singapore</option>

                                        </select>
                                    </div>
                                </div>

                                <div className='col-lg-12'>
                                    <div className='form-group'>
                                        <label>Address</label>
                                        <textarea className = "form-control" value = {address} onChange={e=>addresschange(e.target.value)}></textarea>
                                    </div>
                                </div>

                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label>Gender</label>
                                        <br></br>
                                        <input type="radio" checked = {gender==='male'} onChange={e=>genderchange(e.target.value)} name ="gender" value = 'male' className='app-check mx-1'></input>
                                         <label>Male</label>
                                         <input type="radio" checked = {gender==='female'} onChange={e=>genderchange(e.target.value)} name ="gender" value = 'female' className='app-check mx-1'></input>
                                         <label>female</label>
                                        </div>
                                </div>

                            </div>

                        </div>
                        <div className='card-footer'>
                            <button type="submit" className='btn btn-dark mx-2'>Register</button>
                            <a className='btn btn-light' href='/'>Back</a>
                        </div>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default Registration;
