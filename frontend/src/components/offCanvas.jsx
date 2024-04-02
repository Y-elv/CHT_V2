import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from "react-router-dom";
import { ChatState } from "../components/Context/chatProvider";

function OffCanvasButton() {
  const { user, logoutHandler } = ChatState();
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
            <Offcanvas.Title>
              <span className="navbar-toggler-icon"></span>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="text-center">
            <Link to="/chats" className="d-block mb-2 text-black">
              Chats
            </Link>
            <Link to="/game" className="d-block mb-2 text-black">
              Game
            </Link>
            <Link to="/services" className="d-block mb-2 text-black">
              Services
            </Link>
            <Link to="/news" className="d-block mb-2 text-black">
              News
            </Link>
            <Link
              onClick={() => logoutHandler()}
              to="/login"
              className="d-block mb-2 text-black"
            >
              Logout
            </Link>
            {/* <Link to="/register" className="d-block text-black">Sign Up</Link> */}
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
export default OffCanvasButton  