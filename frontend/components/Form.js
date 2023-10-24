import React, {  useState } from 'react'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.

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
    
  
    const validateFullName = (name) => {
      if (typeof name !== 'string') {
        return validationErrors.fullNameTooShort;
      }
      if (name.length < 3) {
        return validationErrors.fullNameTooShort;
      }
      if (name.length > 20) {
        return validationErrors.fullNameTooLong;
      }
      return '';
    };
  
    const validateSize = () => {
     if (size !== 'S' && size !== 'M' && size !== 'L') {
        return validationErrors.sizeIncorrect;
      }
      return '';
    };
    const handleToppingChange = (toppingId) => {
      if (selectedToppings.includes(toppingId)) {
        setSelectedToppings(selectedToppings.filter((t) => t !== toppingId));
      } else {
        setSelectedToppings([...selectedToppings, toppingId]);
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const fullNameError = validateFullName(fullName);
      const sizeError = validateSize(size);
  
      if (!fullNameError && !sizeError) {
        setFailure(false);
        setSuccess(true);
        setFullName('');
        setSize('');
        setSelectedToppings([]);
      } else {
        setFailure(true);
        setSuccess(false);
      }
    };
 const getToppingsNumber = () => {
    if (selectedToppings.length > 0) {
      return `with ${selectedToppings.length} topping${selectedToppings.length > 1 ? 's' : ''}`;
    } else {
      return 'with no toppings';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
     {success && (
  <div className="success">
    Thank you for your order, {document.getElementById('fullName').value}! Your {size === 'S' ? 'small' : size === 'M' ? 'medium' : 'large'} pizza {getToppingsNumber(toppings)} is on the way.
  </div>
)}
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        
        {fullName && validateFullName(fullName) && (
  <div className='error'>{validateFullName(fullName)}</div>
)}
  
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
       
          {size && validateSize() && <div className='error'>{validateSize()}</div>}
      
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

      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input   type="submit"
        disabled={!fullName || !size || validateFullName(fullName) || validateSize()} 
      />
    </form>
  )
}
