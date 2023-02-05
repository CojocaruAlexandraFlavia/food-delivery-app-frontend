import { useEffect, useState } from "react"
import { Button, Container, Form, Modal } from "react-bootstrap"


const AddProduct = ({restaurantId}) => {

    const [showModal, setShowModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState({
        name:"",
        categoryId:0,
        ingredients:"",
        price:0.0,
        discount:0.0,
        restaurantId:restaurantId
    })
    const [errors, setErrors] = useState({})

    const onChange = (e) => {
        const {id, value} = e.target
        setProduct({ ...product, [id]: value });
        if(errors[id]) {
            setErrors({...errors, [id]: null})
        }
    }

    const findFormErrors = () => {
        const {name, price, ingredients, categoryId} = product
        const requiredField = "Required field"
        const newErrors = {}
        
        if(name === "") newErrors.name =  requiredField
        if(price === 0.0) newErrors.price = requiredField
        if(ingredients === "") newErrors.ingredients = requiredField
        if(categoryId === 0) newErrors.categoryId = requiredField

        return newErrors
    }

    useEffect(() => {
        fetch("/product/categories/all")
            .then(response => response.json()).then(response => setCategories(response))
    }, [])

    const handleSaveProduct = () => {
        const newErrors = findFormErrors()
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            fetch("/product/save", {
                method: "POST",
                body: JSON.stringify(product),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json()).then(() => {
                setShowModal(false)
                setProduct({
                    name:"",
                    categoryId:0,
                    ingredients:"",
                    price:0.0,
                    discount:0.0,
                    restaurantId:restaurantId
                })
                window.location.reload()
            })
        }
    }

    const hideModal = () => {
        setShowModal(false)
        setErrors({})
    }

    return(
        <Container>
            <Modal show={showModal} onHide={hideModal}>
                <Modal.Header closeButton>Add product</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control id={"name"} onChange={onChange} value={product.name} isInvalid={errors.name}/>
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control id={"price"} type="number" onChange={onChange} value={product.price} isInvalid={errors.price}/>
                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Discount</Form.Label>
                            <Form.Control id={"discount"} onChange={onChange} value={product.discount} isInvalid={errors.discount}/>
                            <Form.Control.Feedback type="invalid">{errors.discount}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control id={"ingredients"} onChange={onChange} value={product.ingredients} isInvalid={errors.ingredients}/>
                            <Form.Control.Feedback type="invalid">{errors.ingredients}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Select id={"categoryId"} onChange={onChange} isInvalid={errors.categoryId}>
                                <option value={0}>Select a category</option>
                                {
                                    categories.map((category, i) => <option id={i} value={category.id} key={i}>{category.name}</option>)
                                }
                            </Form.Select>
                        </Form.Group> <br/>
                    <Button variant="success" onClick={handleSaveProduct}>Add product</Button>
                    </Form>
                </Modal.Body>
            </Modal>           
            <Button onClick={() => setShowModal(true)}>Add product</Button>
        </Container>
    )

}

export default AddProduct