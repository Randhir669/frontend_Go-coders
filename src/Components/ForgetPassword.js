import React, { useState } from 'react';
//import axios from 'axios'

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a reset password link to the email address
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ForgotPassword;
