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

  const handleFullNameChange = (e) => {
    const { value } = e.target;

    Yup.reach(formSchema, 'fullName')
      .validate(value)
      .then(() => {
        setErrors({ ...errors, fullName: '' });
        const formValues = { ...form, fullName: value };
        formSchema.isValid(formValues).then((valid) => {
          setDisabled(!valid);
        });
      })
      .catch((err) => {
        setErrors({ ...errors, fullName: err.errors[0] });
        setDisabled(true);
      });

    setForm({ ...form, fullName: value });
  };

  const handleSizeChange = (e) => {
    const { value } = e.target;

    Yup.reach(formSchema, 'size')
      .validate(value)
      .then(() => {
        setErrors({ ...errors, size: '' });
        const formValues = { ...form, size: value };
        formSchema.isValid(formValues).then((valid) => {
          setDisabled(!valid);
        });
      })
      .catch((err) => {
        setErrors({ ...errors, size: err.errors[0] });
        setDisabled(true);
      });

    setForm({ ...form, size: value });
  };

  const handleToppingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    Yup.reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, toppings: '' });
        const formValues = { ...form, toppings: { ...form.toppings, [value]: checked } };
        formSchema.isValid(formValues).then((valid) => {
          setDisabled(!valid);
        });
      })
      .catch((err) => {
        setErrors({ ...errors, toppings: err.errors[0] });
        setDisabled(true);
      });

    setForm({ ...form, toppings: { ...form.toppings, [value]: checked } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    formSchema.isValid(form).then((valid) => {
      if (valid) {
        axios
          .post('https://reqres.in/api/users', form)
          .then(() => {
            const { fullName, size, toppings } = form;

          let orderMessage = `Thank you for your order, ${fullName}! Your ${size} pizza`;

          if (toppings.length > 0) {
            orderMessage += ` with ${toppings.map(t => t.text).join(', ')} is on the way.`;
          } else {
            orderMessage += ' with no toppings is on the way.';
          }

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
           vvalue={form.fullName}
           onChange={handleFullNameChange}
           placeholder="Type full name"
          />
          
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={form.size}
            onChange={handleSizeChange}
          >
            <option value="">----Choose Size----</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
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
              onChange={handleToppingsChange}
              

            />
          
          </label>
        ))}
           
      </div>

      <input disabled={disabled} type="submit" />
    </form>
  )
}