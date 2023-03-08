
import React from 'react'
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
        <a className="navbar-brand" href = "/" style={{color:'white'}}>Text Editor</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href = "/" >Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href = "/" >About<span className="sr-only">(current)</span></a>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            
            <button className="btn btn-outline-success my-2 my-sm-0" onClick={logout}>Logout</button>
          </form>
          </div>
          </nav>

        </div>
        )
}
