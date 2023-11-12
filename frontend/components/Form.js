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
  fullName: Yup.string().required('Full name is required').min(3,validationErrors.fullNameTooShort).max(20,validationErrors.fullNameTooLong),
  size: Yup.string()
    .oneOf(['small', 'medium', 'large'], validationErrors.sizeIncorrect)
    .required('Size is required'),
  peperoni:Yup.boolean(),
  greenpeppers:Yup.boolean(),
  pineapple:Yup.boolean(),
  mushrooms:Yup.boolean(),
  ham:Yup.boolean()
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
  const [form, setForm] = useState({ fullName: '', size: '', toppings: [] });
  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({ fullName: '', size: '', toppings: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    Yup.reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: '' });
        const formValues = { ...form, [name]: newValue };
        formSchema.isValid(formValues).then((valid) => {
          setDisabled(!valid);
        });
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] });
        setDisabled(true);
      });

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    formSchema.isValid(form).then((valid) => {
      if (valid) {
        axios
          .post('https://reqres.in/api/users', form)
          .then(() => {
            const { fullName, size, toppings } = form;
            const orderMessage = `Thank you for your order, ${fullName}! Your ${size} pizza with ${
              form.toppings.length > 0 ? form.toppings.map(t => t.text).join(', ') : 'no toppings'
            } is on the way.`;
            setMessage(orderMessage);
            setForm({ fullName: '', size: '', toppings: [] });
            setErrors({ fullName: '', size: '', toppings: '' });
            setDisabled(true);
          })
          .catch((error) => {
            console.error('Error submitting order:', error);
          });
      } else {
        console.error('Form has validation errors');
      }
    });
  };



  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {message && <div className="success">{message}</div>}
      
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
           type="text"
           id="fullName"
           name="fullName"
           value=''
           onChange={handleChange}
           placeholder="Type full name"
          />
          
          {validationErrors.fullName && <div className="error-message">{validationError.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={form.size}
            onChange={handleChange}
          >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {errors.size && <div className="error-message">{errors.size}</div>}
        </div>
      </div>

      <div className="input-group">
      
        {toppings.map((topping) => (
          <label key={topping.topping_id} htmlFor={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.topping_id}
              checked={form.toppings[topping.topping_id] === true}
              onChange={handleChange}
            />
            {topping.text}<br />
          </label>
        ))}
           
      </div>

      <input type="submit" />
    </form>
  )
}