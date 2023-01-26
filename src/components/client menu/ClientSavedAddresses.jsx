import { Fragment } from "react"


const ClientSavedAddresses = ({addresses}) => {


    return(
        <Fragment>
            {
                addresses !== undefined ? addresses.map((address, i) => <div key={i}>
                    {
                        address.address + "," + address.city + ", " + address.zipCode
                    }
                </div>): null
            }
        </Fragment>
    )

}

export default ClientSavedAddresses