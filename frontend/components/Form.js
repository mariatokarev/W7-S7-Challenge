import React, {  useState } from 'react'
import axios from "axios";
import * as Yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = Yup.object().shape({
  fullName: Yup.string()
  .min(3, validationErrors.fullNameTooShort)
  .max(20, validationErrors.fullNameTooLong)
  .required('Full name is required'),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required('Size is required'),
  toppings: Yup.array()
    .of(Yup.string())
    
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
    const [fullName, setFullName] = useState('');
    const [size, setSize] = useState('');
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [post, setPost] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleToppingChange = (topping_id) => {
      if (selectedToppings.includes(topping_id)) {
        setSelectedToppings(selectedToppings.filter((topping) => topping !== topping_id));
      } else {
        setSelectedToppings([...selectedToppings, topping_id]);
      }
    };
    const validateField = async (field, value) => {
        try {
          const updatedData = { ...formData, [field]: value };
          await formSchema.validateAt(field, updatedData);
          setValidationErrors({ ...validationErrors, [field]: null });
        } catch (error) {
          setValidationErrors({ ...validationErrors, [field]: error.message });
        }
      };
      console.log(validationErrors)
  
      const handleSubmit = (e) => {
        e.preventDefault();
    
        formSchema
          .validate(formData, { abortEarly: false })
          .then(() => {
            setFailure(false);
    
            const order = {
              fullName: fullName,
              size: size,
              toppings: selectedToppings,
            };
    
            axios
              .post("https://reqres.in/api/users", order)
              .then((response) => {
                setSuccess(true);
                console.log("Order submitted successfully:", response.data);
                setPost(response.data);
                setFullName('');
                setSize('');
                setSelectedToppings([]);
              })
              .catch((error) => {
                setSuccess(false);
                console.error("Error submitting order:", error);
              });
          })
          .catch((errors) => {
            setFailure(true);
            setSuccess(false);
            console.error("Validation errors:", errors);
          });
      };
    

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
     {success && (
  <div className="success">
    Thank you for your order, {fullName}! Your{' '}
          {size === 'S' ? 'small' : size === 'M' ? 'medium' : 'large'} pizza{' '}
          {selectedToppings.length} topping(s) is on the way.
        </div>
      )}
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        
      
  
      </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
  <option value="">----Choose Size----</option>
  <option value="S">Small</option>
  <option value="M">Medium</option>
  <option value="L">Large</option>
</select>
       
         
      
        </div>
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping) => (
          <label key={topping.topping_id} htmlFor={topping.topping_id}>
            <input
              name={topping.topping_id}
              type="checkbox"
              checked={selectedToppings.includes(topping.topping_id)}
              onChange={() => handleToppingChange(topping.topping_id)}
            />
            {topping.text}<br />
          </label>
        ))}
        {selectedToppings.length === 0 && (
          <div className="error">Select at least one topping</div>
        )}
        {selectedToppings.length > 0 && (
          <div className="info">Selected {selectedToppings.length} topping(s)</div>
        )}
      </div>


      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input   type="submit"
        disabled={!fullName || !size || selectedToppings.length === 0} 
      />
    </form>
  )
}