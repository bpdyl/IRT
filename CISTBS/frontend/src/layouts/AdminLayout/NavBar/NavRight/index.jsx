import React from 'react';
import {ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
const NavRight = () => {
  const {
    isAuthenticated,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={'end'} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              {/* <i className="icon feather icon-settings" />
               */}
               <div className="pro-head">
               <img src={avatar1} style={{width: '50px', height: '50px'}} className="img-radius" alt="User Profile" />
               </div>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              {/* <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>John Doe</span>
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div> */}
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                {isAuthenticated && (
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" title="Logout" onClick={() => logoutWithRedirect()}>
                  <i className="feather icon-log-out" /> Log Out
                  </Link>
                </ListGroup.Item>
                )}
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavRight;
