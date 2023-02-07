import React from "react";
import { useEffect, useState } from "react";

const RestaurantList = () => {


    const[restaurant, setRestaurants]= useState([])
    const fetchData = () => {
        return fetch(`/restaurant/get-all`, {
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        })
              .then((response) => response.json())
              .then((data) => setRestaurants(data));
      }
    
      useEffect(() => {
        fetchData();
      },[])
      
    return(
        <div className='restaurants__container'>
            <h2>Available Restaurants </h2>
            <ul>
        {restaurant && restaurant.length > 0 && restaurant.map((restaurant, index) => (
            <li key="{restaurant.id}">{restaurant.name} {restaurant.rating} </li>
          ))}
      </ul>
        </div>
    )
}
export default RestaurantList
