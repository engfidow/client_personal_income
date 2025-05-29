import React, { useState } from "react";
import * as Components from "./Components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [signIn, toggle] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...formLoginData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const newErrors = {};
    const { name, email, password, confirmPassword, image } = formData;

    if (!name) newErrors.name = "Name is required";
    else if (!validateName(name)) newErrors.name = "Only letters & spaces allowed";

    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password)) newErrors.password = "Min 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      if (image) data.append("image", image);

      await axios.post("https://server-personal-income.onrender.com/api/auth/register", data);
      toggle(true);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setLoading(true);

    try {
      const res = await axios.post("https://server-personal-income.onrender.com/api/auth/login", formLoginData);
      if (res.status === 200) {
        const { token, user } = res.data;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/admin");
      }
    } catch (err) {
      setErrors({ api: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form onSubmit={handleRegister}>
          <Components.Title>Create Account</Components.Title>

          <Components.Input type="text" name="name" placeholder="Name" onChange={handleChange} />
          {formSubmitted && errors.name && <label className="text-red-500 text-xs">{errors.name}</label>}

          <Components.Input type="email" name="email" placeholder="Email" onChange={handleChange} />
          {formSubmitted && errors.email && <label className="text-red-500 text-xs">{errors.email}</label>}

          <Components.Input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} />
          {formSubmitted && errors.password && <label className="text-red-500 text-xs">{errors.password}</label>}

          <Components.Input type={passwordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
          {formSubmitted && errors.confirmPassword && <label className="text-red-500 text-xs">{errors.confirmPassword}</label>}

          <label className="text-sm text-left w-full mt-2 mb-1">Upload Image</label>
          <Components.Input type="file" name="image" onChange={handleChange} />

          {errors.api && <label className="text-red-500 text-xs mt-2 block">{errors.api}</label>}

          <Components.Button type="submit">{loading ? "Loading..." : "Sign Up"}</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form onSubmit={handleLogin}>
          <Components.Title>Sign In</Components.Title>

          <Components.Input type="email" name="email" placeholder="Email" onChange={handleLoginChange} />
          {formSubmitted && !formLoginData.email && <label className="text-red-500 text-xs">Enter email</label>}

          <Components.Input type="password" name="password" placeholder="Password" onChange={handleLoginChange} />
          {formSubmitted && !formLoginData.password && <label className="text-red-500 text-xs">Enter password</label>}

          <Components.Anchor href="/auth/forgot-password">Forgot your password?</Components.Anchor>
          {errors.api && <label className="text-red-500 text-xs">{errors.api}</label>}

          <Components.Button type="submit">{loading ? "Loading..." : "Sign In"}</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <img src={logo} alt="Logo" style={{ width: 150, display: "block" }} />
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected, please login with your personal info.
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>Sign In</Components.GhostButton>
          </Components.LeftOverlayPanel>
          <Components.RightOverlayPanel signinIn={signIn}>
            <img src={logo} alt="Logo" style={{ width: 150, display: "block" }} />
            <Components.Title>Hello!</Components.Title>
            <Components.Paragraph>
              Enter your personal details and start your journey with us.
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>Sign Up</Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default Login;
