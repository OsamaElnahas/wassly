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
                
              <div className="row gx-0 " style={{ 
                minHeight: "52.4vh" 
              }}>
                <div className={ isVisable? "col-2":""}>
                  <SideBar setVisable={setVisable} isVisable={isVisable}/>
                </div>
                <div className= {!isVisable? "col-12  mt-3" : "col-10 mt-3"} style={{
                  transition: '0.3s ease',
                }}>

                  <Outlet  />
                </div>
              </div>
              <Footer />
            </>
          );
        }
        
