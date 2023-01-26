import React from "react";
import { useEffect, useState, Fragment } from "react";
import { Container, Table } from "react-bootstrap"
import { useParams } from "react-router"
import LoadingSpinner from "./util/LoadingSpinner"

const RestaurantPage = ({restaurantId}) => {

    const {idParam} = useParams()
    let id = idParam !== undefined ? idParam : restaurantId

  
    const[restaurant, setRestaurant] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

      const controller = new AbortController()
      const signal = controller.signal

    fetch(`/restaurant/get-by-id/${id}`, {
      signal: signal
    }).then(response => response.json()).then(response => {
        setRestaurant(response)
        setLoading(false)
    })

    return () => {
        controller.abort()
    }
}, [id])

return(
  <Container>
      {
          loading? <LoadingSpinner/> : 
          <Fragment>
              <h2>Restaurant: {restaurant.name}</h2>
              <h2>Rating: {restaurant.rating}</h2>
              <Table responsive bordered hover>
                  <thead>
                      <tr>
                          <th>Product</th>
                          <th>Ingredients</th>
                         
                      </tr>
                  </thead>
                  <tbody>
                      {
                          restaurant.products.map((restaurantProduct, i) => <tr key={i}>
                              <th>{restaurantProduct.name}</th>
                              <th>{restaurantProduct.ingredients}</th>
                              
                          </tr>)
                      }
                  
                  </tbody>
              </Table>
             
            
      </Fragment>
  }
  </Container>)

}
export default RestaurantPage
