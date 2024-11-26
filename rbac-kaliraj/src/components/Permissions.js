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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  GetApp as GetAppIcon, 
} from "@mui/icons-material";
import Sidebar from "./SideBar";

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState({
    id: Date.now(),
    name: "",
    description: "",
  });
  const [permissionToDelete, setPermissionToDelete] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role;

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch("http://localhost:3001/permissions");
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (permission) => {
    setCurrentPermission(permission);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (permission) => {
    setPermissionToDelete(permission);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/permissions/${permissionToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete permission");
      }

      setPermissions(permissions.filter((perm) => perm.id !== permissionToDelete.id));
      setDeleteDialogOpen(false);
      setPermissionToDelete(null);

      const fetchPermissions = async () => {
        try {
          const res = await fetch("http://localhost:3001/permissions");
          const data = await res.json();
          setPermissions(data);
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
      };
      fetchPermissions();

    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentPermission({ id: Date.now(), name: "", description: "" });
  };

  const handleSave = async () => {
    if (currentPermission.id && permissions.some((p) => p.id === currentPermission.id)) {
      try {
        await fetch(`http://localhost:3001/permissions/${currentPermission.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentPermission),
        });
        setPermissions(
          permissions.map((perm) =>
            perm.id === currentPermission.id ? currentPermission : perm
          )
        );
      } catch (error) {
        console.error("Error updating permission:", error);
      }
    } else {
      try {
        const newPermission = {
          name: currentPermission.name,
          description: currentPermission.description,
        };

        const response = await fetch("http://localhost:3001/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPermission),
        });
        const addedPermission = await response.json();
        setPermissions([...permissions, addedPermission]);
      } catch (error) {
        console.error("Error adding permission:", error);
      }
    }
    handleDialogClose();
  };

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to export data to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Permission Name", "Description"];
    const rows = permissions.map((permission) => [
      permission.id,
      permission.name,
      permission.description,
    ]);

    const csvContent = [
      headers.join(","),  // Join header values with commas
      ...rows.map((row) => row.join(",")),  // Join each row's values with commas
    ]
      .join("\n")  // Join the rows with new line characters
      .replace(/,/g, ",");  // Ensure proper CSV formatting

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "permissions.csv";  // File name for download
    link.click();
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
            <u>Permissions</u>
          </h1>
          <TextField
            variant="outlined"
            size="small"
            label="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
          {userRole !== "Manager" && userRole !== "Viewer" && (
            <IconButton color="primary" onClick={() => setOpenDialog(true)}>
              <AddIcon />
            </IconButton>
          )}
            <IconButton color="primary" onClick={exportToCSV}>
              <GetAppIcon /> {/* Export Icon */}
            </IconButton>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="permissions table">
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No.</TableCell>
                <TableCell align="center">Permission Name</TableCell>
                <TableCell align="center">Description</TableCell>
                {userRole !== "Manager" && userRole !== "Viewer" && (
                <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPermissions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((permission, index) => (
                  <TableRow key={permission.id}>
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">{permission.name}</TableCell>
                    <TableCell align="center">{permission.description}</TableCell>
                    { userRole !== "Viewer" && (
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(permission)}
                      >
                        <EditIcon />
                      </IconButton>
                      {userRole !== "Manager" && (
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(permission)}
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
          count={filteredPermissions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Dialog for Add/Edit */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {currentPermission.id ? "Edit Permission" : "Add Permission"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Permission Name"
              fullWidth
              variant="outlined"
              value={currentPermission.name}
              onChange={(e) =>
                setCurrentPermission({ ...currentPermission, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={currentPermission.description}
              onChange={(e) =>
                setCurrentPermission({
                  ...currentPermission,
                  description: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Permission</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this permission?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Permissions;
