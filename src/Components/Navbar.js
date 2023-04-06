
import React ,{useState,useEffect} from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';


export default function Navbar(prop) {
  // <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />

  const usenavigate = useNavigate("")
  const [user, setuser] = useState('');
  
  useEffect(() => {

    var username = sessionStorage.getItem('username');
    var username = sessionStorage.getItem('username');
    console.log(username)
    setuser(username)
   
   
  }, []);
 

  function logout() {
    usenavigate('/')
  }
  return (
    <div>
    
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      
          <Button className="nav-link btn btn-dark navbar-brand" href="/TextEditor" style={{ color: 'white' }}>Text Editor</Button>
          <Button className="nav-link btn btn-dark" href="#" >Home <span className="sr-only">(current)</span></Button>
          <Button className="nav-link btn btn-dark" href="#" >About<span className="sr-only">(current)</span></Button>
            <form className="d-flex ml-auto">
<<<<<<< HEAD
            <DropdownButton  className="btn roundborder" variant="" title={user}>
            <Dropdown.Item as="button" variant="dark" menuVariant="dark" onClick={logout}>Logout</Dropdown.Item>
            </DropdownButton>
            </form>
       



      </nav>
      

    </div>
  )
=======
            <Button className="btn btn-outline-success my-2 my-sm-0" onClick={logout}>Logout</Button>
            </form>
      </nav>
    </div>
        )
>>>>>>> bee27ef73f34b015e3761ab3ec121fa4148bdb96
}
