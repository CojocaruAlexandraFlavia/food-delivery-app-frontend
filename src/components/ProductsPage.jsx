import { Fragment, useState, useCallback, useEffect } from "react"
import { Button, Container, Modal } from "react-bootstrap"
import { useParams } from "react-router"
import UpdateProduct from "./UpdateProduct"

const ProductsPage = ({restaurantId}) => {

    const {idParam} = useParams()
    let restId = idParam !== undefined ? idParam : restaurantId

    const [allProducts, setAllProducts] = useState([])
    const [setDeleted] = useState(false)
    const [setChanged] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [productId, setProductId] = useState(0)

    const getAllProducts = useCallback(() => {
        fetch(`/product/get-all-by-restaurantId/${restId}`)
            .then(response => response.json())
            .then(response => setAllProducts(response))
    }, [restId])

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

    const changeAvailability = (id) => {
      fetch(`/product/change-availability/${id}`, {
          method: "PATCH",
      }).then(response => {
          if(response.status === 200) {
              getAllProducts()
              setChanged(true)       
              setTimeout(() => {
                  setChanged(false)
              }, 5000)
          } 
      })
    } 

    const closeModal = () => {
        setEditModal(false)
    }

    const editProductId = (id) => {
      setProductId(id)
      setEditModal(true)
    }

    return(
        <Container>
            {
              allProducts.map((product, i) => <Fragment key={i}>
                  <div style={boxStyle}>
                      <h5>{product.name}</h5>
                      <h6>Price: {product.price}</h6>
                      <h6>Discount: {product.discount}</h6>
                      <h6>Ingredients: {product.ingredients}</h6>
                      <h6>Availability: {product.availability.toString()}</h6>
                      
                      <br/>
                      { 
                      //deleted? <h3>Deleted successfully</h3>: null 
                      } 
            
                      <Button variant="danger" onClick={() => deleteProduct(product.id)}>Delete</Button>
                      <Button onClick={() => editProductId(product.id)}>Edit</Button>
                      <Button variant="secondary" onClick={() => changeAvailability(product.id)}>Change Availability</Button>
                  </div> <br/>

                  <Modal show={editModal} onHide={closeModal}>
                      <Modal.Header closeButton>Edit product</Modal.Header>
                      <Modal.Body>
                          <UpdateProduct productId={productId}/>
                      </Modal.Body>
                  </Modal>
              </Fragment>)
            }
          
        </Container>
    )
}

export default ProductsPage