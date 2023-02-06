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
    const [setChanged] = useState(false)
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


    const findFormErrors = () => {
      const {name, price, discount, ingredients, categoryId} = product
      const newErrors = {}
      const requiredField = "Required field"

      if(name === "") newErrors.name = requiredField
      if(price === "") newErrors.price = requiredField
      if(discount === "") newErrors.discount = requiredField
      if(ingredients === "") newErrors.ingredients = requiredField
      if(categoryId === "") newErrors.categoryId = requiredField
      return newErrors
    }

    const onChange = (e) => {
      const {id, value} = e.target
      setProduct({ ...product, [id]: value });
      if(errors[id]) {
          setErrors({...errors, [id]: null})
      }
    }

    const saveProduct = () => {

      const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } 
        else 
        {
          console.log(product)

          const controller = new AbortController()
          const signal = controller.signal

          fetch("/product/save", {
              method:"POST",
              body: JSON.stringify(product),
              signal:signal,
              headers:{
                  "Content-Type":"application/json",
                  "Accept":"application/json"
              }
          }).then(response => {
              if(response.status === 200) {
                setProductAdded(true)
                  setErrors({})
                  setProduct({
                    name:"",
                    price:"",
                    discount:"",
                    ingredients:"",
                    availability:true,
                    restaurantId:restId,
                    categoryId:0
                  })
                  setTimeout(() => {
                    setProductAdded(false)
                  }, 5000)
              }
          })
        }
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
                        user.role === "ROLE_RESTAURANT_MANAGER"? <Fragment>
                            <Button variant="danger" onClick={() => deleteProduct(product.id)}>Delete</Button>
                            <Button onClick={() => editProductId(product.id)}>Edit</Button>
                            <Button variant="secondary" onClick={() => changeAvailability(product.id)}>Change Availability</Button>   
                        </Fragment>: null
                      }
                      {
                        user.role === "ROLE_CLIENT_USER"? <Button onClick={() => addProductToCart(product.id)}>Add to cart</Button>: null
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
        </Container>
    )
}

export default ProductsPage