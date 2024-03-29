

import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



export default function ForgetPassword() {
  const [showsubmitbutton, setshowsubmitbutton] = useState(true)
  const [showloadingbutton, setshowloadingbutton] = useState(false)


  const form = useRef();
  const navigate = useNavigate('')
  const MySwal = withReactContent(Swal)

  const url = "https://lnah1ozkmb.execute-api.us-east-1.amazonaws.com"
  //const url = "http://localhost:8000";


  function backtologin() {
    navigate('/')
  }

  async function verifyemail() {

    setshowsubmitbutton(false)
    setshowloadingbutton(true)
    try {
      let response = await fetch(url + "/userdata")
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      let resp = await response.json()
      let fullname, user
      let email = document.getElementById('resetemail').value
      let filtereddata = resp.filter((res) => res.email === email)
      if (filtereddata.length !== 0) {
        user = filtereddata[0].id
        fullname = filtereddata[0].name
        triggeremail(fullname, user)
      } else {
        MySwal.fire({
          title: <strong>Email Not Found</strong>,
          html: <i>Please Enter valid email</i>,
          icon: 'warning'
        })
      }
      setshowsubmitbutton(true)
      setshowloadingbutton(false)
    } catch (error) {
      console.log(error)
    }
  }

  function triggeremail(fullname, user) {

    let email = document.getElementById('resetemail').value
    var template_params = {
      'to_email': email,
      'fullname': fullname,
      'user': user
    };
    emailjs.send('service_ow9fq7m', 'template_mchvy5g', template_params, 'mOAC_5gkWPHi4RVjh')
      .then((result) => {
        console.log(result.text);
        MySwal.fire({
          title: <strong>Reset Link Sent!</strong>,
          html: <i>Reset Link Sent to your email,please check your inbox to continue.</i>,
          icon: 'success'
        })
      }, (error) => {
        console.log(error.text);

      });
    setshowsubmitbutton(true)
    setshowloadingbutton(false)
  }



  return (


    <div className='offset-lg-4 col-lg-4'>

      <Card className="card" style={{ boxShadow: '1px 2px 9px #6c757d', marginTop: '100px', marginBottom: '15px' }}>
        <form className='container margintopbottom'>
          <div className='card'>
            <div className="card-header">
              <div className="w-100">
                <h3 className="text-center ">Reset Password</h3>
              </div>

            </div>
            <form ref={form} className="signin-form card-body">
              <div className="form-group mt-3 " >
                <label className="form-control-placeholder" >Email</label>
                <input type="text" id='resetemail' className="form-control" />


              </div>
              <div className="form-group ">
                {showsubmitbutton && <button type="button" className="form-control btn btn-dark rounded submit px-3" onClick={verifyemail}>
                  Submit</button>}
                {showloadingbutton && <button class="form-control btn btn-dark rounded submit px-3" type="button" disabled>
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  &nbsp;Submit
                </button>}

              </div>
              <div className="form-group ">
                <button type="button" className="form-control btn rounded submit px-3 btn-light" onClick={backtologin}>
                  Cancel</button>
              </div>


            </form>
          </div>
        </form>
      </Card>
    </div>
  );
}

