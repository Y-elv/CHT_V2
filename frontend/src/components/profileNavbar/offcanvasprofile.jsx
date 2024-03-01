import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from "react-router-dom";
import { Dropdown, Space, Menu } from "antd";

function OffCanvasProfile() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const items = [
      {
        key: '1',
        label: (
          <Link to="/service">
            Counseling and Therapy
          </Link>
        ),
      
       
      },
      {
        key: '2',
        label: (
          <Link to="/service">
           Mental Health
          </Link>
        ),
       
      },
      {
        key: '3',
        label: (
          <Link to="/service">
           Sexual Advices 
          </Link>
        ),
      
      },
    
    ];

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
          <Link to="/consultation" className="d-block mb-2 text-black">Consultation</Link>
          <Link to="/chat" className="d-block mb-2 text-black">Chat</Link>

          <Link  className="d-block mb-2 text-black">
          
                    <Dropdown
                      overlay={
                        <Menu>
                          {items.map((item) => (
                            <Menu.Item key={item.key} icon={item.icon}>
                              {item.label}
                            </Menu.Item>
                          ))}
                        </Menu>
                      }
                    >
                      <a
                        onClick={(e) => e.preventDefault()}
                        className="iconn"
                        style={{ 
                          textDecoration: "none",
                         }}
                      >
                        <Space>
                        Services
                        </Space>
                      </a>
                    </Dropdown>
                  
          </Link>
          <Link to="/news" className="d-block mb-2 text-black">News</Link>
          <Link to="/login" className="d-block text-black">Sign out</Link>
        </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
export default OffCanvasProfile 