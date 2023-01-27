import { Fragment, useState, useCallback, useEffect } from "react"
import { Button, Container, Modal, Form } from "react-bootstrap"
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
                      <h4>{product.name}</h4>
                      <h5>Price: {product.price}</h5>
                      <h5>Discount: {product.discount}</h5>
                      <h5>Ingredients: {product.ingredients}</h5>
                      <h5>Availability: {product.availability.toString()}</h5>
                      
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

            <Button variant="success" onClick={saveOpenModal}>Add product</Button>
            <Modal show={saveModal} onHide={closeSaveModal}>
              <Modal.Header closeButton>Add product</Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control id={"name"} value={product.name} isInvalid={errors.name} onChange={onChange}/>
                      <Form.Control.Feedback type={"invalid"}>{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control id={"price"} value={product.price} isInvalid={errors.price} onChange={onChange}/>
                      <Form.Control.Feedback type={"invalid"}>{errors.price}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Discount</Form.Label>
                      <Form.Control id={"discount"} value={product.discount} isInvalid={errors.discount} onChange={onChange}/>
                      <Form.Control.Feedback type={"invalid"}>{errors.discount}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Ingredients</Form.Label>
                      <Form.Control id={"ingredients"} value={product.ingredients} isInvalid={errors.ingredients} onChange={onChange}/>
                      <Form.Control.Feedback type={"invalid"}>{errors.ingredients}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Category Id</Form.Label>
                      <Form.Control id={"categoryId"} value={product.categoryId} isInvalid={errors.categoryId} onChange={onChange}/>
                      <Form.Control.Feedback type={"invalid"}>{errors.categoryId}</Form.Control.Feedback>
                  </Form.Group>
                <Button variant="success" onClick={saveProduct}>Add product</Button>
                <br/><br/>
                {
                    productAdded? <h3 style={{color:"green"}}>Product added successfully</h3> : null
                }
                </Form>

              </Modal.Body>
            </Modal>

        </Container>
    )
}

export default ProductsPage