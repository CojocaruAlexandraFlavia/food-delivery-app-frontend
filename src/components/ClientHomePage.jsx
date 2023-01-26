import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";

const ClientHomePage = () => {

    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {

        const controller = new AbortController()
        const signal = controller.signal
        const token = sessionStorage.getItem("token")

        fetch("/restaurant/get-all", {
            signal: signal,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(response => setRestaurants(response))

        return () => {
            controller.abort()
        }

    }, [])


    return(
        <Fragment>
            <Container>
                <h1>Client home page</h1>
                {
                    restaurants.map((restaurant, i) => <Fragment key={i}>
                        <h4>{restaurant.name}</h4>
                        <h4>Nr. de telefon: {restaurant.phoneNumber}</h4>
                        <h4>Rating: {restaurant.rating}</h4>
                        <h4>Review-uri:</h4>
                        {
                            restaurant.reviews.map((review, j) => <Fragment key={j}>
                                <h5>Stele: {review.stars}</h5>
                                <h5>Comentariu: {review.comment}</h5>
                                <h5>Client: {review.clientFirstName} {review.clientLastName}</h5>
                            </Fragment>)
                        }
                    </Fragment>)
                }
            </Container>
        </Fragment>
    )

}

export default ClientHomePage