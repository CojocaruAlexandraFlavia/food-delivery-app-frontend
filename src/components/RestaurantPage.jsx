import React from "react";
import { useEffect, useState, Fragment } from "react";
import { Container} from "react-bootstrap"
import { useParams } from "react-router"
import LoadingSpinner from "./util/LoadingSpinner"
import ProductsPage from "./ProductsPage"


const RestaurantPage = ({restaurantId}) => {

    const {idParam} = useParams()
    let id = idParam !== undefined ? idParam : restaurantId

  
    const[restaurant, setRestaurant] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

    

    fetch(`/restaurant/get-by-id/${id}`, {
      
    }).then(response => response.json()).then(response => {
        setRestaurant(response)
        setLoading(false)
    })

    return () => {
    }
}, [id])

return(
  <Container>
      {
          loading? <LoadingSpinner/> : 
          <Fragment>
          
          <img src='src/images/restaurants/desert.jpg' alt ="img" />
              <h2>Restaurant {restaurant.name}</h2>
              <h2>Rating {restaurant.rating}</h2>

              <ProductsPage products={restaurant.products}/>
              
             
            
      </Fragment>
  }
  </Container>)

}
export default RestaurantPage
