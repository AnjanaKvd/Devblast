import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
  Avatar,
  InputAdornment,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import * as api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user, mode = 'view') => {
    setCurrentUser(user);
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.updateUserRole(id, role);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      // Only update role in this component
      await api.updateUserRole(currentUser._id, currentUser.role);
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'staff':
        return 'warning';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        User Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Index No</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 1, bgcolor: user.role === 'admin' ? 'error.main' : 'primary.main' }}>
                          {getInitials(user.name)}
                        </Avatar>
                        <Typography variant="body2">
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.indexNo || '-'}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          renderValue={(selected) => (
                            <Chip
                              size="small"
                              label={selected.charAt(0).toUpperCase() + selected.slice(1)}
                              color={getRoleColor(selected)}
                            />
                          )}
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="staff">Staff</MenuItem>
                          <MenuItem value="user">User</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDialog(user, 'view')}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton 
                          size="small" 
                          color="info"
                          onClick={() => handleOpenDialog(user, 'edit')}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Details/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'view' ? 'User Details' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          {currentUser && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      mr: 2,
                      bgcolor: currentUser.role === 'admin' ? 'error.main' : 'primary.main',
                      fontSize: '1.5rem'
                    }}
                  >
                    {getInitials(currentUser.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{currentUser.name}</Typography>
                    <Chip
                      size="small"
                      label={currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                      color={getRoleColor(currentUser.role)}
                    />
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  value={currentUser.email}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  margin="dense"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Index Number"
                  fullWidth
                  value={currentUser.indexNo || '-'}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  margin="dense"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Created At"
                  fullWidth
                  value={new Date(currentUser.createdAt).toLocaleDateString()}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  margin="dense"
                />
              </Grid>
              
              {dialogMode === 'edit' && (
                <Grid item xs={12}>
                  <FormControl fullWidth margin="dense">
                    <Select
                      value={currentUser.role}
                      onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                      label="Role"
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode === 'edit' && (
            <Button onClick={handleUpdateUser} variant="contained">
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
