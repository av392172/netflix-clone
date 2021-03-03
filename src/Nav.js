import React, { useEffect, useState } from 'react';
import "./Nav.css";

function Nav() {
    const [show, handlleShow] = useState(false);

    const transitionNavBar = () => {
        if (window.scrollY > 100) {
            handlleShow(true);
        }
        else {
            handlleShow(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", transitionNavBar);
        return () => window.removeEventListener("scroll", transitionNavBar);
    }, []);


    return (
        <div className={`nav ${show && "nav__black"}`}>
            <div className="nav__contents">
                {/* <img className="nav__logo" src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png" alt="logo" /> */}
                <img className="nav__logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png" alt="logo" />
            </div>

            {/* <img className="nav__avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7PjLmSA1amw4J-GIX9vf0wMXPyGAVReAwQ&usqp=CAU" alt="avtar logo" /> */}
            <img className="nav__avatar" src="https://pro2-bar-s3-cdn-cf1.myportfolio.com/dddb0c1b4ab622854dd81280840458d3/98032aebff601c1d993e12a0_rw_600.png?h=8030f4d5734548795c22da59ca72e3e1" alt="avtar logo" />
        </div>
    )
}

export default Nav
