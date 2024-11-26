// src/components/SignIn.js
import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users?username=${username}&password=${password}`);
      const users = await response.json();
      if (users.length > 0) {
        localStorage.setItem("user", JSON.stringify(users[0]));
        navigate("/home");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Error during login.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", paddingTop: 5 }}>
      <Typography variant="h5" gutterBottom>Sign In</Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button onClick={handleLogin} variant="contained" fullWidth sx={{ marginTop: 2 }}>Sign In</Button>
    </Box>
  );
};

export default SignIn;
