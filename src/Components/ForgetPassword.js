

import React, { useRef } from 'react';
import emailjs from 'emailjs-com';

export default function ForgetPassword() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_ow9fq7m', 'template_e4co5oc', form.current, 'mOAC_5gkWPHi4RVjh',{ to_email: e.target.to_email.value })
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="username" />
      <label>Email</label>
      <input type="password" name="password" />
      <input type="email" name="to_email" placeholder="Recipient's email address" />
     <input type="submit" value="Send" />
    </form>
  );
}

