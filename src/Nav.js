import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Nav.css';

function Nav() {
    const [show, handleShow] = useState(false);
    const navigate = useNavigate();

    const transitionNavBar = () => {
        if (window.scrollY > 100) {
            handleShow(true);
        } else {
            handleShow(false);
        }
    };

    useEffect(() =>  {
        window.addEventListener("scroll", transitionNavBar);
        return () => window.addEventListener("scroll", transitionNavBar);
    }, []);

    return(
        <div className={`nav ${show && 'nav_black'}`}>
          <div className='nav_contents'>
            <img 
              onClick={() => navigate.push("/")}
              className='nav_logo'
              src='https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' 
              alt='NETFLIX'
            />

            <img
              onClick={() => navigate.push("/profile")}
              className='nav_avatar'
              src='https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
              alt='' />
            </div>
        </div>
    );
}
export default Nav;

