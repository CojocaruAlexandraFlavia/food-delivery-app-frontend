import { Fragment, useState, useCallback, useEffect } from "react"
import { Button, Container, Modal } from "react-bootstrap"
import UpdateProduct from "./UpdateProduct"


const ProductsPage = () => {

    const [allProducts, setAllProducts] = useState([])
    const [deleted, setDeleted] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const getAllProducts = useCallback(() => {
        fetch("/product/get-all")
            .then(response => response.json())
            .then(response => setAllProducts(response))
    }, [])

    useEffect(() => {
        getAllProducts()
    }, [getAllProducts])
    
    const boxStyle = {boxShadow:"1px 1px 4px 4px lightgrey", padding:"5px"}

    const deleteProduct = (id) => { 

        fetch( `/product/delete-by-id/${id}`, {
            method: "DELETE"
        }).then(response => {
            if(response.status === 200) {
                getAllProducts()
                setDeleted(true)
                setTimeout(() => {
                    setDeleted(false)
                }, 5000)
            }
        })
    }

    const closeModal = () => {
        setEditModal(false)
    }

    return(
        <Container>
            {
                allProducts.map((product, i) => <Fragment key={i}>
                    <div style={boxStyle}>
                        <h3>Name: {product.name}</h3>
                        <h3>Price: {product.price}</h3>
                        <h3>Discount: {product.discount}</h3>
                        <h3>Ingredients: {product.ingredients}</h3>
                        <h3>Quantity: {product.quantity}</h3>
                        <h3>Availability: {product.availability}</h3>
                        
                        <br/>
                        {
                            deleted? <h3>Deleted successfully</h3>: null
                        }

                        <Button variant="danger" onClick={() => deleteProduct(product.id)}>Delete</Button>
                        <Button onClick={() => setEditModal(true)}>Edit</Button>
                    </div> <br/>

                    <Modal show={editModal} onHide={closeModal}>
                        <Modal.Header closeButton>Edit product</Modal.Header>
                        <Modal.Body>
                            <UpdateProduct productId={product.id}/>
                        </Modal.Body>
                    </Modal>
                </Fragment>)
            }
          
        </Container>
    )
}

export default ProductsPage