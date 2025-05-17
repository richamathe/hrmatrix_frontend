import React from 'react'
function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
            <div className="container">
              <a className="navbar-brand" href="#">
                <img src="/logo.png" alt="HR Solutions" height="40" />
                <span className="ms-2 brand-name">HRFlow</span>
              </a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link to='/login' className="nav-link btn signup-btn ml-4">Login</Link>
                  </li>
                  <li className="nav-item">
                  <Link to='/sign' className="btn signup-btn">Sign up</Link> </li>
                </ul>
              </div>
            </div>
          </nav>
  )
}

export default NavBar