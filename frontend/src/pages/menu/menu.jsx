import "./menu.css"
import logo from "../../assets/LOGO FULL.png"
import { Link } from "react-router-dom";

const Menu = () => {
    return ( 
        <>
        <div className="menu-container">
           <div className="left-menu-container">
             <div className="menu-logo">
                <img src={logo}/>
             </div>
             <div className="menu-links-left">
                <Link to="/"className="links">Articles</Link>
                <Link to="/"className="links">Puzzles</Link>
                <Link to="/"className="links">Videos</Link>
             </div>
             <div className="menu-footer">
                <p className="links">Get in touch</p>
                <p><span className="span">info@kundwahealth.org</span></p>
             </div>
           </div>
           <div className="middle-menu-container">
            <div className="menu-links-right">
            <Link to="/menu"className="links">Menu</Link>
               <Link to="/consultation"className="links">Consultation</Link>
               <Link to="/"className="links">OUR Team</Link>
               <Link to=""className="links">About</Link>
               <Link to=""className="links">Logoout </Link>
            </div>
            <div className="menu-footer-right">
                <p className="links">Privacy Policy and Cookies</p>
                <p><span className="span">©Kundwa Health 2023</span></p>
            </div>
               
           </div>
           <div className="right-menu-container">
            <img src={profileAvatar}/>

           </div>

        </div>
        </>
     );
}
 
export default Menu;