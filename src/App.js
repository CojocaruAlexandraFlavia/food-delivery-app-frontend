import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ClientHomePage from './components/ClientHomePage';
import AdminHomePage from './components/AdminHomePage';
import DeliveryUserHomePage from './components/DeliveryUserHomePage';
import RestaurantManagerHomePage from './components/RestaurantManagerHomePage';
import UserContext from './components/context/UserContext';
import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import AddRestaurantManager from './components/AddRestaurantManager';
import AddRestaurant from './components/AddRestaurant';
import UpdateRestaurant from './components/UpdateRestaurant';

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
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/home-client' element={<ClientHomePage/>}/>
                    <Route path='/home-admin' element={<AdminHomePage/>}/>
                    <Route path='/home-delivery-user' element={<DeliveryUserHomePage/>}/>
                    <Route path='/home-restaurant-manager' element={<RestaurantManagerHomePage/>}/>
                    <Route path='/add-restaurant-manager' element={<AddRestaurantManager/>}/>
                    <Route path='/add-restaurant' element={<AddRestaurant/>}/>
                    <Route path='/update-restaurant/:id' element={<UpdateRestaurant/>}/>
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
