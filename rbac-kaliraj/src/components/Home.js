import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Grid, CardHeader } from "@mui/material";
import Sidebar from "./SideBar";

const Home = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((response) => response.json())
      .then((data) => {
        setUsersCount(data.length); 
        const roles = new Set(data.map((user) => user.role));
        setRolesCount(roles.size);
      });

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser)); 
    }
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          padding: 3,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",  
            justifyContent: "center",  
            height: "200px",  
            textAlign: "center",  
          }}
        >
          <h1><u>Home</u></h1>
        </Box>

        {user && (
          <Typography variant="h6" sx={{ marginBottom: 3 }}>
            Welcome, <b>{user.username}</b> ({user.role})!
          </Typography>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: "#1976d2", color: "white" }}>
              <CardHeader title="Total Users" />
              <CardContent>
                <Typography variant="h4">{usersCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: "#388e3c", color: "white" }}>
              <CardHeader title="Total Roles" />
              <CardContent>
                <Typography variant="h4">{rolesCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
