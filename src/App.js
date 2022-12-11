import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ClientHomePage from './components/ClientHomePage';
import AdminHomePage from './components/AdminHomePage';
import DeliveryUserHomePage from './components/DeliveryUserHomePage';
import RestaurantManagerHomePage from './components/RestaurantManagerHomePage';
import UserContext from './components/context/UserContext';
import React, { useState, useEffect } from 'react';

function App() {

    const [user, setUser] = useState({})

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        if(token !== "undefined" && token !== null){
            fetch("/get-info-from-token/" + token, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then(response => response.json())
                .then(response => setUser(response))
        }
    }, [])

    return (
        <UserContext.Provider value={{user, setUser}}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login/>}/>
                    <Route path='/home-client' element={<ClientHomePage/>}/>
                    <Route path='/home-admin' element={<AdminHomePage/>}/>
                    <Route path='/home-delivery-user' element={<DeliveryUserHomePage/>}/>
                    <Route path='/home-restaurant-manager' element={<RestaurantManagerHomePage/>}/>
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/App.js</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        // </div>
    );
}

export default App;
