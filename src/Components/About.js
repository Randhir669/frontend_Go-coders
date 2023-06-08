import React from 'react'
import Card from 'react-bootstrap/Card';


export default function About() {
  return (
    <div className='offset-lg-1 col-lg-10'>

      <Card className="card" style={{ boxShadow: '1px 2px 9px #6c757d', marginTop: '50px', marginBottom: '15px' }}>
        <form className='container margintopbottom'>
          <div className='card'>
            <div className="card-header">
              <div className="w-100">
                <h3 className="text-center ">Go-Coders</h3>
              </div>

            </div>
            <form className="signin-form card-body">

              <h5>
                I'm thrilled to announce the launch of www.go-coders.com, a platform designed to simplify file management and enhance productivity. With our platform, you can easily store and download your files, making it convenient to access your important documents anytime, anywhere.<br></br><br></br>

                But that's not all! We've taken it a step further by enabling seamless file sharing with other go-coders users. Collaborate effortlessly by sharing files with colleagues, friends, or family, ensuring smooth communication and efficient teamwork.<br></br><br></br>

                Additionally, www.go-coders.com offers a unique feature that allows you to save personal notes. Whether it's capturing ideas, jotting down reminders, or organizing your thoughts, our platform ensures that your notes are securely stored and readily available whenever you need them.<br></br><br></br>

                At www.go-coders.com, we're passionate about empowering individuals and teams to optimize their workflow and achieve more. Our user-friendly interface and robust functionality make managing files and notes a breeze.<br></br><br></br>

                join us on this exciting journey! Visit www.go-coders.com today and experience the convenience and efficiency it offers. Feel free to reach out if you have any questions or feedback. Together, let's unlock your full potential!


              </h5>
            </form>


          </div>
        </form>
      </Card>
    </div>
  );

}
