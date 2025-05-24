import React, { useState } from "react";
import * as Components from './Components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [signIn, toggle] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [formLoginData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleInputChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePasswordComplexity = (password) => password.length >= 6;
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const { name, email, password, confirmPassword, image } = formData;
    const newErrors = {};

    if (!name) newErrors.name = "Name is required";
    else if (!validateName(name)) newErrors.name = "Name can only contain letters and spaces";

    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (!validatePasswordComplexity(password)) newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      if (image) data.append("image", image);

      const response = await axios.post("https://server-personal-income.onrender.com/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toggle(true);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setErrors({ api: error.response?.data?.message || "Registration failed" });
    }
  };

  const handleFormSubmitLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const { email, password } = formLoginData;

    if (!email || !password) return;
    if (!validateEmail(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    try {
      const response = await axios.post("https://server-personal-income.onrender.com/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setErrors({ api: "Email or password is incorrect" });
    }
  };

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form onSubmit={handleFormSubmit}>
          <Components.Title>Create Account</Components.Title>

          <Components.Input type="text" name="name" placeholder="Name" onChange={handleInputChange} />
          {formSubmitted && errors.name && <label className="text-red-700 text-xs">{errors.name}</label>}

          <Components.Input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
          {formSubmitted && errors.email && <label className="text-red-700 text-xs">{errors.email}</label>}

          <Components.Input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" onChange={handleInputChange} />
          {formSubmitted && errors.password && <label className="text-red-700 text-xs">{errors.password}</label>}

          <Components.Input type={passwordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange} />
          {formSubmitted && errors.confirmPassword && <label className="text-red-700 text-xs">{errors.confirmPassword}</label>}

          <label className="text-sm text-left w-full mt-2 mb-1">Upload Image</label>
          <Components.Input type="file" name="image" onChange={handleInputChange} />

          {errors.api && <label className="text-red-700 text-xs mt-2 block">{errors.api}</label>}

          <Components.Button type="submit">Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form onSubmit={handleFormSubmitLogin}>
          <Components.Title>Sign in</Components.Title>

          <Components.Input type="email" placeholder="Email" name="email" onChange={handleInputChangeLogin} />
          {formSubmitted && errors.email && <label className="text-red-700 text-xs">{errors.email}</label>}

          <Components.Input type="password" placeholder="Password" name="password" onChange={handleInputChangeLogin} />
          {formSubmitted && !formLoginData.password && <label className="text-red-700 text-xs">Please enter your password</label>}

         <Components.Anchor href="/auth/forgot-password">Forgot your password?</Components.Anchor>

          {errors.api && <label className="text-red-700 text-xs mt-2 block">{errors.api}</label>}

          <Components.Button type="submit">Sign In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>Sign In</Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Hello, Customer!</Components.Title>
            <Components.Paragraph>
              Enter your personal details and start your journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>Sign Up</Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default Login;
