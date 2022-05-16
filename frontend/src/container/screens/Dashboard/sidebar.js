/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";

import "./../../Layout/Dashboard/sidebar.css";
import Profile from "./../../../assets/images/profile.png";
import { LogoSvg } from "../../../assets/svgs";
import Exercise from "./exercise";
import { useHistory } from "react-router-dom";

function Sidebar() {
  let history = useHistory();
  let [profileName, setProfileName] = useState("");

  function logout() {
    window.localStorage.clear();
    history.push("/login");
  }
  useEffect(() => {
    setProfileName(window.localStorage.getItem("firstName"));
  }, []);

  return (
    <div className="sidebar-wapper">
      <div className="sidebar-container">
        <div className="sidebar-logo">
          <LogoSvg className="logo-image" />
          <div className="logo_text">LOGO</div>
        </div>
        <div className="sidebar-menues">
          <div className="menue-list m1">
            <div>
              <i class="fa fa-home" aria-hidden="true"></i>
            </div>
            <div className="text d-text">Dashboard</div>
          </div>
        </div>
      </div>
      <div className="sidebar-profile ">
        <div className="profile-header">
          <div className="profile-content">
            <div className="p1">
              <img src={Profile} width="50" alt="profile-image" />
              <div className="online-indicator"></div>
              <div className="name-text">
                Hello, <span className="name">{profileName}</span>
              </div>
            </div>
            <div className="p2">
              <button className="logout-botton" onClick={() => logout()}>Logout</button>
            </div>
          </div>
        </div>

        <div className="exercise">
          <Exercise />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
