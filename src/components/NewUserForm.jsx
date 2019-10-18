import React, {useState, useEffect} from 'react';
import { withFormik, Form, Field } from 'formik';
import styled from 'styled-components';
import * as Yup from 'yup';
import axios from 'axios';

const StyledContainer = styled.div.attrs( props => ({
  className: 'user-container',
}))`

  width: 80%;
  min-width: 300px;
  max-width: 1200px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 8px rgba( 33, 33, 33, 0.3);

  h3 {
    margin-bottom: 0.5rem;
  }
`;

const StyledCardContainer = styled.div.attrs( props => ({
  className: 'card-container',
}))`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`;

const StyledForm = styled.div.attrs( props => ({
  className: 'user-form',
}))`

  width: 80%;
  min-width: 300px;
  max-width: 1200px;
  display: flex;
  padding: 1rem;
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-evenly;
  box-shadow: 0 0 8px rgba( 33, 33, 33, 0.17);
`;

const StyledFields = styled.div.attrs( props => ({
  className: 'form-field-wrapper',
}))`

  display: flex;
  padding: 1rem;
  margin: 0 auto;
  flex-direction: column;

  input, checkbox, button {
    margin: 0.4rem;
  }
`;

const StyledUser = styled.div.attrs( props => ({
  className: 'user-card',
  }))`
  display: flex;
  flex-direction: column;
  width: 10rem;
  margin: 2rem;
  padding: 0.4rem;
  box-shadow: 0 0 8px rgba( 33, 33, 33, 0.8);

  dl {
    margin-top:  0;
  }
`;

const NewUserForm = ({ values, touched, errors, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    status && setUsers( () => [...users, status] )
  }, [ status ] );

  return (
    <div>
      <StyledForm className='user-form'>
      <h3>New User:</h3>
      <Form>
        <StyledFields className='form-field-wrapper'>
        <Field
          type = 'text'
          name = 'name'
          placeholder = 'Name' />
        {touched.name && errors.name && (
          <p className = 'error'>{ errors.name }</p>
        )}

        <Field
          type = 'text'
          name = 'email'
          placeholder = 'Email' />
        {touched.email && errors.email && (
          <p className = 'error'>{ errors.email }</p>
        )}

        <Field
          type = 'text'
          name = 'passwd'
          placeholder = 'Password' />
        {touched.passwd && errors.passwd && (
          <p className = 'error'>{ errors.passwd }</p>
        )}

        <label className="checkbox-container">
          {" "}
          Terms of Service
          <Field
            type="checkbox"
            name="tos"
            checked={values.tos} />
          {touched.tos && errors.tos && (
            <p className = 'error'>{ errors.tos }</p>
          )}
          <span className="checkmark" />
        </label>

        <button type="submit">Submit!</button>
        </StyledFields>
      </Form>
      </StyledForm>

      <StyledContainer className='user-container'>
      <h3>User List:</h3>
      <StyledCardContainer className='card-container'>
      {
        users.map( user => (
          <StyledUser className='user-card' key={user.id}>
            <h3>{ user.name }</h3>

            <dl>
              <dt>
                { user.email  }</dt>
            </dl>
          </StyledUser>
        ) )        
      }
      </StyledCardContainer>
      </StyledContainer>
    </div>
  );
};

const FormikNewUserForm = withFormik( {
  mapPropsToValues( { name, email, passwd, tos } ) {
    return {
      name:     name || '',
      email:   email || '',
      passwd: passwd || '',
      tos:       tos || false
    };
  },
  validationSchema: Yup.object().shape({
    name:   Yup.string ().required(),
    email:  Yup.string ().required(),
    passwd: Yup.string ().required(),
    tos:    Yup.boolean().oneOf( [true], 'Terms of Service Must be Accepted' )
  }),
  handleSubmit( values, { setStatus, resetForm } ) {
    axios.post ( 'https://reqres.in/api/users/', values )
         .then ( res => { console.log( res ); setStatus( res.data ); } )
         .catch( err =>   console.log( err.response ) );
    
    resetForm();
   }
} ) ( NewUserForm );

export default FormikNewUserForm;
