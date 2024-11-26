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
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import Sidebar from "./SideBar";
import { v4 as uuidv4 } from "uuid";  // Import uuid for unique ID generation

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissionsList, setPermissionsList] = useState(["Read", "Edit", "Delete", "Create"]);  // Sample permissions
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    id: null,
    name: "",
    description: "",
    permissions: [],
  });
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role;


  // Fetch roles data
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3001/roles");
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Search functionality
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open the dialog for editing or adding a role
  const handleOpenDialog = (role = null) => {
    setCurrentRole(role || { id: null, name: "", description: "", permissions: [] });
    setOpenDialog(true);
  };

  // Handle role save (either edit or add)
  const handleSaveRole = async () => {
    let newRole = { ...currentRole };

    if (currentRole.id) {
      // Edit existing role
      try {
        await fetch(`http://localhost:3001/roles/${currentRole.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentRole),
        });
        setRoles(
          roles.map((role) =>
            role.id === currentRole.id ? currentRole : role
          )
        );
      } catch (error) {
        console.error("Error updating role:", error);
      }
    } else {
      // Add new role with a UUID as ID
      newRole = { ...currentRole, id: uuidv4() };  // Generate a unique ID using uuidv4

      try {
        const response = await fetch("http://localhost:3001/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRole),
        });
        const addedRole = await response.json();
        setRoles([...roles, addedRole]);
      } catch (error) {
        console.error("Error adding role:", error);
      }
    }
    setOpenDialog(false);
  };

  // Open the delete confirmation dialog
  const handleOpenDeleteDialog = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  // Delete role
  const handleDeleteRole = async () => {
    try {
      await fetch(`http://localhost:3001/roles/${roleToDelete.id}`, {
        method: "DELETE",
      });
      setRoles(roles.filter((role) => role.id !== roleToDelete.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  // Filtered roles based on search query
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePermissionChange = (event) => {
    const { value } = event.target;
    setCurrentRole({
      ...currentRole,
      permissions: value,
    });
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
            <u>Roles</u>
          </h1>
          <TextField
            variant="outlined"
            size="small"
            label="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
                          {userRole !== "Manager" && userRole !== "Viewer" && (

          <IconButton color="primary" onClick={() => handleOpenDialog()}>
            <AddIcon />
          </IconButton>
)}
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="roles table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No.</TableCell>
                <TableCell align="center">Role Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Permissions</TableCell>
                {userRole !== "Viewer" && (
                <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((role, index) => (
                  <TableRow key={role.id}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{role.name}</TableCell>
                    <TableCell align="center">{role.description}</TableCell>
                    <TableCell align="center">{role.permissions.join(", ")}</TableCell>
                    {userRole !== "Viewer" && (
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenDialog(role)}>
                        <EditIcon />
                      </IconButton>
                      {userRole !== "Manager" && (
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(role)}
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
          count={filteredRoles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Dialog for Add/Edit Role */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{currentRole.id ? "Edit Role" : "Add Role"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Role Name"
              fullWidth
              variant="outlined"
              value={currentRole.name}
              onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={currentRole.description}
              onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
            />

            {/* Dropdown or Checkbox Group for Permissions */}
            <FormControl fullWidth margin="dense">
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                value={currentRole.permissions}
                onChange={handlePermissionChange}
                label="Permissions"
              >
                {permissionsList.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Alternatively, use checkboxes if you prefer checkboxes */}
            {/* {permissionsList.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={currentRole.permissions.includes(permission)}
                    onChange={(e) => handleCheckboxChange(e, permission)}
                    value={permission}
                  />
                }
                label={permission}
              />
            ))} */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogContent>Are you sure you want to delete this role?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteRole} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Roles;
