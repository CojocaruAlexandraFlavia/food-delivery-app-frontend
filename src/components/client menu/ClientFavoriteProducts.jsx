import { Fragment } from "react"


const ClientFavoriteProducts = ({products}) => {


    return(
        <Fragment>
            {
                products !== undefined ? products.map((product, i) => <div key={i}>
                    <h3>{product.name} <br/>
                        {product.price}
                    </h3>
                </div>): null
            }
        </Fragment>
    )

}

export default ClientFavoriteProducts