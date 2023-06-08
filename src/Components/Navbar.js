
import React ,{useState,useEffect} from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';



export default function Navbar(prop) {
  // <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />

  const usenavigate = useNavigate("")
  const [user, setuser] = useState('');
  
  useEffect(() => {

    var username = sessionStorage.getItem('username');
    console.log(username)
    setuser(username)
   
   
  }, []);
 

  function logout() {
    usenavigate('/')
  }

  function Filemanager() {
    usenavigate('/Filemanager')
  }

  function About() {
    usenavigate('/About')
  }

  function Notesmanager() {
    usenavigate('/Notesmanager')
  }



  return (
    <div>
    
      <nav className="navbar navbar-expand-lg  bg-dark">
          
      <Button className="nav-link btn btn-dark navbar-brand"  onClick={Filemanager}>File Manager <span className="sr-only">(current)</span></Button>
      <Button className="nav-link btn btn-dark navbar-brand " onClick={Notesmanager} style={{ color: 'white' }}>Notes Manager</Button>
      <Button className="nav-link btn btn-dark navbar-brand"  onClick={About}>About<span className="sr-only">(current)</span></Button>
            <form className="d-flex ml-auto">
            <DropdownButton  className="roundborder btn" variant ="light" title={user}>
            <Dropdown.Item as="button" variant="dark" menuVariant="dark" onClick={logout}>Logout</Dropdown.Item>
            </DropdownButton>
            </form>
       



      </nav>
      

    </div>
  )
}
