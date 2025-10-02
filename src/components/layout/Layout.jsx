import React, { useState } from "react";
import Nav from "../Nav/Nav";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import styles from "./Layout.module.css";

export default function Layout() {
  const [isVisible, setVisible] = useState(true);

  return (
    <div className={styles.layoutContainer}>
      <SideBar setVisible={setVisible} isVisible={isVisible} />
      <div
        className={`${styles.mainContent} ${!isVisible ? styles.expanded : ""}`}
      >
        <Nav isVisible={isVisible} />

        <div className={styles.pageContent}>
          <div className="container px-0" style={{ maxWidth: "1550px" }}>
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
