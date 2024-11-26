import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import Sidebar from "./SideBar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);  // State for delete confirmation dialog
  const [userToDelete, setUserToDelete] = useState(null);  // Store the user to delete

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:3001/users/${userId}`, { method: "DELETE" });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      role: e.target.value,
    }));
  };

  const handleStatusChange = (e) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      status: e.target.value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      if (currentUser.id) {
        const response = await fetch(
          `http://localhost:3001/users/${currentUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(currentUser),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === currentUser.id ? currentUser : user
          )
        );
      } else {
        const response = await fetch(`http://localhost:3001/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentUser),
        });

        if (!response.ok) {
          throw new Error("Failed to add user");
        }

        const newUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating or adding user:", error);
    }
  };

  const handleAddUser = () => {
    setCurrentUser({
      username: "",
      email: "",
      password: "",
      role: "Viewer",
      status: "Active",
    });
    setOpenDialog(true);
  };

  const exportAsCSV = () => {
    const csvData = users.map((user) => ({
      UserID: user.id,
      Name: user.username,
      Email: user.email,
      Role: user.role,
      Status: user.status,
    }));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["UserID,Name,Email,Role,Status"]
        .concat(csvData.map((row) => Object.values(row).join(",")))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete confirmation
  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
    }
    setDeleteConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setUserToDelete(null);
  };

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
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <h1>
            <u>Users</u>
          </h1>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search by username or email"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
                        {userRole !== "Manager" && userRole !== "Viewer" && (
            <Tooltip title="Add User">
              <IconButton color="primary" onClick={handleAddUser}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
            <Tooltip title="Export as CSV">
              <IconButton color="secondary" onClick={exportAsCSV}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Status</TableCell>
                {userRole !== "Viewer" && (
                <TableCell align="center">Action</TableCell>
              )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align="center">{user.id}</TableCell>
                    <TableCell align="center">{user.username}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{user.role}</TableCell>
                    <TableCell align="center">{user.status}</TableCell>
                    {userRole !== "Viewer" && (
                    <TableCell align="center">
                      {/* Conditionally render EditIcon based on role from localStorage */}
                     
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(user)}
                        >
                          <EditIcon />
                        </IconButton>
                                              {userRole !== "Manager" && (
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteConfirmation(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                                                                    )}
                    </TableCell>
                                          )}

                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleCancelDelete}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete this user?</DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

        {currentUser && (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>{currentUser.id ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent>
              <TextField
                name="username"
                label="Name"
                value={currentUser.username}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="email"
                label="Email"
                value={currentUser.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                value={currentUser.password || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={currentUser.role || ""}
                  onChange={handleRoleChange}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentUser.status || ""}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateUser} color="primary">
                {currentUser.id ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default Users;
