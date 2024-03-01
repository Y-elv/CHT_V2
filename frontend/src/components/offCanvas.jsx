import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from "react-router-dom";

function OffCanvasButton() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button 
         onClick={handleShow} 
       
         className="navbar-toggler"
         type="button"
         data-toggle="collapse"
         data-target="#navbarNav"
         aria-controls="navbarNav"
         aria-expanded="false"
         aria-label="Toggle navigation"
         
         >
        <span className="navbar-toggler-icon"></span>
        </Button>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title><span className="navbar-toggler-icon"></span></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="text-center">
          <Link to="/updates" className="d-block mb-2 text-black">Updates</Link>
          <Link to="/our-team" className="d-block mb-2 text-black">Our Team</Link>
          <Link to="/menu" className="d-block mb-2 text-black">Menu</Link>
          <Link to="/login" className="d-block mb-2 text-black">Log in</Link>
          <Link to="/register" className="d-block text-black">Sign Up</Link>
        </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
export default OffCanvasButton  