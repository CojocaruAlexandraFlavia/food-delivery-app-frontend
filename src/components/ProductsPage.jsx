import { Fragment, useState, useCallback, useEffect, useContext } from "react"
import { Button, Container, Modal, Form } from "react-bootstrap"
import { useParams } from "react-router"
import UpdateProduct from "./UpdateProduct"
import UserContext from "../components/context/UserContext"


const ProductsPage = ({restaurantId}) => {

    const {idParam} = useParams()
    const {user} = useContext(UserContext)
    let restId = idParam !== undefined ? idParam : restaurantId

    const [allProducts, setAllProducts] = useState([])
    const [deleted, setDeleted] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [productId, setProductId] = useState(0)
    
    const [errors, setErrors] = useState({})
    const [saveModal, setSaveModal] = useState(false)
    const [productAdded, setProductAdded] = useState(false)
    const [product, setProduct] = useState({
      name:"",
      price:"",
      discount:"",
      ingredients:"",
      availability:true,
      restaurantId:restId,
      categoryId:""
    })

    const [productAddedFavoriteList, setProductAddedFavoriteList] = useState(false)
    const [productFavorite, setProductFavorite] = useState({
      productId: 0,
      clientUserId: 0
    })
    const [productAddedToCart, setProductAddedToCart] = useState(false)

    const getAllProducts = useCallback(() => {
        fetch(`/product/get-all-by-restaurantId/${restId}`)
            .then(response => response.json())
            .then(response => setAllProducts(response))
    }, [restId])
    useEffect(() => { getAllProducts() }, [getAllProducts])
    
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
          } 
      })
    } 

    const addToFavorite = (id) => {
      console.log(productFavorite)

      const controller = new AbortController()
      const signal = controller.signal

      productFavorite.productId = id
      productFavorite.clientUserId = user.id

      fetch(`/product/add-product-to-client-favorites`, {
        method:"POST",
        body: JSON.stringify(productFavorite),
        signal:signal,
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
      }).then(response => {
        if(response.status === 200) {
          setProductAddedFavoriteList(true)
            setErrors({})
            setTimeout(() => {
              setProductAddedFavoriteList(false)
            }, 2000)
        }
      })
    }

  const addProductToCart = (id) => { 
    if(product.availability === true){
      const requestBody ={
        "clientId":user.id,
        "productId":id,
        "quantity":1
      }
    fetch( `/order/add-products`, {
        method: "PUT",
        body:JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
      if(response.status === 200) {
        setProductAddedToCart(true)
          setErrors({})
          setTimeout(() => {
            setProductAddedToCart(false)
          }, 5000)
      }
    })
    } 
  }

    const closeModal = () => {
        setEditModal(false)
    }

    const editProductId = (id) => {
      setProductId(id)
      setEditModal(true)
    }

    const closeSaveModal = () => {
      setSaveModal(false)
    }

    const saveOpenModal = () => {
      setSaveModal(true)
    }

    const closeAddToCartModal = () => {
      setProductAddedToCart(false)
    }

    const openAddToCartModal = () => {
      setProductAddedToCart(true)
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
                      <h6>Availability: {product.availability.toString()}</h6> <br/>
                      {
                        user.role === "ROLE_RESTAURANT_MANAGER"? <Fragment>
                            <Button variant="danger" onClick={() => deleteProduct(product.id)}>Delete</Button>
                            <Button onClick={() => editProductId(product.id)}>Edit</Button>
                            <Button variant="secondary" onClick={() => changeAvailability(product.id)}>Change Availability</Button>   
                        </Fragment>: null
                      }
                      {
                        user.role === "ROLE_CLIENT_USER"? <Fragment>
                            <Button variant="warning" onClick={() => addToFavorite(product.id)}>Add to Favorite List</Button>
                            <Button variant="info" onClick={() => {addProductToCart(product.id); openAddToCartModal()}}>Add to cart</Button>
                        </Fragment> :null
                      }                      
                  </div> <br/>                  
                  <Modal show={editModal} onHide={closeModal}>
                    <Modal.Header closeButton>Edit product</Modal.Header>
                    <Modal.Body>
                        <UpdateProduct productId={productId}/>
                    </Modal.Body>
                  </Modal>
              </Fragment>)
            }
            <br/>
            { 
              deleted? <h3>Deleted successfully</h3>: null 
            }       
            {
                productAddedFavoriteList? <h3 style={{color:"green"}}>Product added successfully to Favorite List</h3> : null
            }
            {
              <Modal show={productAddedToCart} onHide={closeAddToCartModal}>
                <Modal.Header closeButton> </Modal.Header>
                <Modal.Body>
                  <h3 style={{color:"green"}}>Product added successfully to Cart</h3>
                </Modal.Body>
              </Modal>
            } <br/>
        </Container>
    )
}

export default ProductsPage