  import React, { useState } from 'react'
  import Nav from '../Nav/Nav'
  import Footer from '../footer/Footer'
  import { Outlet } from 'react-router-dom'
  import SideBar from '../SideBar/SideBar'


  export default function Layout() {
      const [isVisable,setVisable]=useState(true)
  
    
    
          return (
            < >
            
              <Nav />
                <div className="parent" style={{
                  display:"flex",
                  flexDirection:"column",

                }}>

              <div className="d-flex" style={{
                flex:"1",
                minHeight: "29.15vh" 
              }}>
                <div className={ isVisable? "col-2":""}>
                  <SideBar setVisable={setVisable} isVisable={isVisable}/>
                </div>
                <div className= {!isVisable? "col-12  mt-3" :   " col-10 content flex-grow-1 mt-3"} style={{
                  transition: '0.3s ease',
                }}>
                  <Outlet />
                </div>
              </div>
              <Footer />
                  </div>
            </>
          );
        }
        
