import React from "react";
import { useEffect, useState } from "react";

const RestaurantPage = () => {

    const[restaurants, setRestaurants]= useState([])
    const fetchData = () => {
        return fetch("http://localhost:8088/restaurant/get-all")
              .then((response) => response.json())
              .then((data) => setRestaurants(data));
      }
    
      useEffect(() => {
        fetchData();
      },[])
    return(
        <div className='restaurants__container'>
            <h2>Available Restaurants </h2>
              {/* {restaurants.map(restaurant =>
                  <div key={restaurant.id}>
                    {restaurant.name} ({restaurant.rating})
                  </div>
              )} */}
            <ul>
        {restaurants && restaurants.length > 0 && restaurants.map((restaurant, index) => (
            <li key="{restaurant.id}">{restaurant.name} {restaurant.rating} </li>
          ))}
      </ul>
        </div>
    )

}

export default RestaurantPage
