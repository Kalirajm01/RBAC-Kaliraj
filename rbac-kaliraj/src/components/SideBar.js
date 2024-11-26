import React, { useState, useEffect  } from "react";
import { Drawer, List, ListItem, ListItemIcon, Divider, Tooltip } from "@mui/material";
import { Home, People, Security, Settings, ExitToApp } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [user, setUser] = useState(null); 

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (route) => {
    navigate(route);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 60,
          flexShrink: 0,
          height: "100vh", 
          "& .MuiDrawer-paper": {
            width: 60,
            boxSizing: "border-box",
            backgroundColor: "#333",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: "16px", 
          },
        }}
        open
      >
        <List sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Tooltip title="Home" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation("/home")}
              sx={{
                padding: "12px 0", 
                backgroundColor: isActive("/home") ? "#555" : "transparent",
                borderRadius: "8px",
                marginBottom: "60px", 
              }}
            >
              <ListItemIcon>
                <Home sx={{ ml: 2, color: isActive("/home") ? "#FFD700" : "white" }} />
              </ListItemIcon>
            </ListItem>
          </Tooltip>

          <Tooltip title="Users" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation("/users")}
              sx={{
                padding: "12px 0", 
                backgroundColor: isActive("/users") ? "#555" : "transparent",
                borderRadius: "8px",
                marginBottom: "60px", 
              }}
            >
              <ListItemIcon>
                <People sx={{ ml: 2, color: isActive("/users") ? "#FFD700" : "white" }} />
              </ListItemIcon>
            </ListItem>
          </Tooltip>

          <Tooltip title="Permissions" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation("/permissions")}
              sx={{
                padding: "12px 0",
                backgroundColor: isActive("/permissions") ? "#555" : "transparent",
                borderRadius: "8px",
                marginBottom: "60px", 
              }}
            >
              <ListItemIcon>
                <Security sx={{ ml: 2, color: isActive("/permissions") ? "#FFD700" : "white" }} />
              </ListItemIcon>
            </ListItem>
          </Tooltip>

          <Tooltip title="Roles" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation("/roles")}
              sx={{
                padding: "12px 0", 
                backgroundColor: isActive("/roles") ? "#555" : "transparent",
                borderRadius: "8px",
                marginBottom: "60px",
              }}
            >
              <ListItemIcon>
                <Settings sx={{ ml: 2, color: isActive("/roles") ? "#FFD700" : "white" }} />
              </ListItemIcon>
            </ListItem>
          </Tooltip>

          <Tooltip title="Sign Out" placement="right">
            <ListItem
              button
              onClick={() => {              
                localStorage.removeItem("user");
                handleNavigation("/")}}
              sx={{
                padding: "12px 0", 
                backgroundColor: isActive("/") ? "#555" : "transparent",
                borderRadius: "8px",
                marginBottom: "10px", 
              }}
            >
              <ListItemIcon>
                <ExitToApp sx={{ ml: 2, color: isActive("/") ? "#FFD700" : "white" }} />
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        </List>
        <Divider />
      </Drawer>
    </>
  );
};

export default Sidebar;
