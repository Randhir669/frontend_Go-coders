
import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';

export default function Navbar(prop) {
  // <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />

  const usenavigate = useNavigate("")

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
            <Button className="btn btn-outline-success my-2 my-sm-0" onClick={logout}>Logout</Button>
            </form>
      </nav>
    </div>
        )
}
