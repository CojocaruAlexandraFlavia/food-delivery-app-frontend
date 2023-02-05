import { Fragment } from "react"


const ManagerOwnedRestaurants = ({restaurants}) => {


    return(
        <Fragment>
            {
                restaurants !== undefined ? restaurants.map((restaurant, i) => <Fragment>

                </Fragment>): null
            }
        </Fragment>
    )
    

}

export default ManagerOwnedRestaurants