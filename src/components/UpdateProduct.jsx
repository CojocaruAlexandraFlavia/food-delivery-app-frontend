import { useState, useEffect } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useParams } from "react-router"

const UpdateProduct = ({productId}) => {
  
  const {paramId} = useParams()
  const id = paramId !== null && paramId !== undefined? paramId: productId
  
  const [product, setProduct] = useState({
      name:"",
      price:"",
      discount:"",
      ingredients:""
  })
  const [errors, setErrors] = useState({})
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    fetch(`/product/get-by-id/${id}`).then(response => response.json()).then(response => {
      setProduct({
        name: response.name,
        price: response.price,
        discount: response.discount,
        ingredients: response.ingredients
      })
    })
  }, [id])

  const findFormErrors = () => {
    const {name, price, discount, ingredients} = product
    const newErrors = {}

    if(name === "") newErrors.name = "Required field"
    if(price === "") newErrors.price = "Required field"
    if(discount === "") newErrors.discount = "Required field"
    if(ingredients === "") newErrors.ingredients = "Required field"

    return newErrors
  }


  const update = () => {
    const newErrors = findFormErrors()
    if(Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
    } else {
        fetch(`/product/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(product),
            headers: {
                "Content-Type":"application/json"
            }
        }).then(response => {
            if(response.status === 200) {
                setUpdated(true)
                setErrors({})
                setTimeout(() => {
                    setUpdated(false)
                }, 3000)
            } 
        })
    }
}

return(
  <Container>
      <Form>
          <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={product.name} isInvalid={errors.name} onChange={(e) => setProduct({...product, name:e.target.value})}/>
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control value={product.price} isInvalid={errors.price} onChange={(e) => setProduct({...product, price:e.target.value})}/>
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
              <Form.Label>Discount</Form.Label>
              <Form.Control value={product.discount} isInvalid={errors.discount} onChange={(e) => setProduct({...product, discount:e.target.value})}/>
              <Form.Control.Feedback type="invalid">{errors.discount}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
              <Form.Label>Ingredients</Form.Label>
              <Form.Control value={product.ingredients} isInvalid={errors.ingredients} onChange={(e) => setProduct({...product, ingredients:e.target.value})}/>
              <Form.Control.Feedback type="invalid">{errors.ingredients}</Form.Control.Feedback>
          </Form.Group> <br/>

          <Button variant="success" onClick={update}>Update details</Button>
          {
              updated? <h3 style={{color:"green"}}>Details updated successfully!</h3>: null
          }
      </Form>
  </Container>
)

}

export default UpdateProduct