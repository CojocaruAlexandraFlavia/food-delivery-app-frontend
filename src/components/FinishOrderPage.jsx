import { Fragment, useContext, useEffect, useState } from "react"
import 'rsuite/dist/rsuite.min.css';
import { Panel } from 'rsuite';
import { Button} from "react-bootstrap"
import UserContext from "../components/context/UserContext"

const FinishOrderPage = () => {

    const {user} = useContext(UserContext)
    const[deliveryTax, setDeliveryTax] = useState(0.0)
}
export default FinishOrderPage