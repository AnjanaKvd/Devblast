import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  Tab,
  Tabs,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import * as api from '../../services/api';

const RiceCurryManagement = () => {
  const [riceCurries, setRiceCurries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    price: '',
    type: '',
    quantityForOne: 1,
    image: '',
    stock: 100
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url'); // 'file' or 'url'
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRiceCurries();
  }, []);

  const fetchRiceCurries = async () => {
    setLoading(true);
    try {
      const { data } = await api.getRiceCurries();
      setRiceCurries(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch rice and curry items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
      setPreviewUrl(item.image || '');
      setUploadMethod('url');
    } else {
      setCurrentItem({
        name: '',
        price: '',
        type: '',
        quantityForOne: 1,
        image: '',
        stock: 100
      });
      setPreviewUrl('');
      setSelectedFile(null);
      setIsEditing(false);
      setUploadMethod('url');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'price' || name === 'stock' || name === 'quantityForOne' ? Number(value) : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);
    // Clear previous selections when changing methods
    if (method === 'url') {
      setSelectedFile(null);
      setPreviewUrl(currentItem.image || '');
    } else {
      // When switching to file upload, clear the URL
      if (!previewUrl.startsWith('data:')) {
        setPreviewUrl('');
      }
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      // Create an image element to load the file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        // Create a canvas with max dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }
        }, file.type, 0.7); // Adjust quality here (0.7 = 70% quality)
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  const uploadImage = async () => {
    if (!selectedFile) return currentItem.image;
    
    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > 10) {
      throw new Error(`File size too large (${fileSizeMB.toFixed(2)}MB). Maximum allowed is 10MB.`);
    }
    
    setUploading(true);
    try {
      // Resize image if it's a photo
      let fileToUpload = selectedFile;
      if (selectedFile.type.startsWith('image/')) {
        try {
          const resizedBlob = await resizeImage(selectedFile);
          fileToUpload = new File([resizedBlob], selectedFile.name, {
            type: selectedFile.type,
            lastModified: new Date().getTime()
          });
          console.log(`Image resized: ${selectedFile.size / 1024}KB → ${fileToUpload.size / 1024}KB`);
        } catch (resizeError) {
          console.warn("Image resize failed, using original:", resizeError);
        }
      }
      
      // Convert file to base64 for server upload
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          console.log(`Image encoded, size: ${(base64String.length / (1024 * 1024)).toFixed(2)}MB`);
          setUploading(false);
          resolve(base64String);
        };
        reader.onerror = () => {
          setUploading(false);
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(fileToUpload);
      });
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploading(false);
      throw err;
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!currentItem.name.trim()) {
      setError('Item name is required');
      return;
    }
    if (!currentItem.type) {
      setError('Item type is required');
      return;
    }
    if (!currentItem.price || currentItem.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setError('');
    setUploading(true);
    
    try {
      let updatedItem = {...currentItem};
      
      // Handle image upload if a file is selected
      if (uploadMethod === 'file' && selectedFile) {
        try {
          const imageUrl = await uploadImage();
          updatedItem = {
            ...updatedItem,
            image: imageUrl
          };
        } catch (uploadError) {
          setError(`Image upload failed: ${uploadError.message}`);
          setUploading(false);
          return;
        }
      }
      
      if (isEditing) {
        await api.updateRiceCurry(currentItem._id, updatedItem);
      } else {
        await api.addRiceCurry(updatedItem);
      }
      fetchRiceCurries();
      handleCloseDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`${isEditing ? 'Failed to update' : 'Failed to add'} item: ${errorMessage}`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteRiceCurry(id);
        fetchRiceCurries();
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'rice':
        return 'Rice Base';
      case 'curry':
        return 'Curries';
      case 'extra':
        return 'Extra Rice';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getTypeColor = (type) => {
    if (type.includes('rice')) return 'success';
    if (type.includes('chicken') || type.includes('fish')) return 'warning';
    if (type.includes('vegetable') || type.includes('dhal')) return 'info';
    return 'default';
  };
  
  // Add custom styles for file upload area
  const fileUploadStyles = {
    dropzone: {
      border: '2px dashed #cccccc',
      borderRadius: '4px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border .3s ease-in-out',
      marginTop: '10px',
      '&:hover': {
        border: '2px dashed #2196f3',
      }
    },
    preview: {
      mt: 2,
      p: 1,
      borderRadius: 1,
      border: '1px solid #eee',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Rice & Curry Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Item
        </Button>
      </Box>

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
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riceCurries.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={item.image || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #eee'
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getTypeLabel(item.type)}
                      color={getTypeColor(item.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>Rs {item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(item)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(item._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Item Name"
                fullWidth
                value={currentItem.name}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                fullWidth
                value={currentItem.price}
                onChange={handleInputChange}
                margin="dense"
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={currentItem.type}
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="rice">Rice Base</MenuItem>
                  <MenuItem value="curry">Curries</MenuItem>
                  <MenuItem value="extra">Extra</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantityForOne"
                label="Quantity for One Person"
                type="number"
                fullWidth
                value={currentItem.quantityForOne}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stock"
                label="Available Stock"
                type="number"
                fullWidth
                value={currentItem.stock}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
            
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Item Image
                </Typography>
                <Tabs
                  value={uploadMethod}
                  onChange={(e, newValue) => handleUploadMethodChange(newValue)}
                  aria-label="image upload method"
                  sx={{ mb: 2 }}
                >
                  <Tab 
                    value="url" 
                    label="Image URL" 
                    icon={<LinkIcon />} 
                    iconPosition="start"
                  />
                  <Tab 
                    value="file" 
                    label="Upload Image" 
                    icon={<CloudUploadIcon />} 
                    iconPosition="start"
                  />
                </Tabs>
                
                <Divider sx={{ mb: 2 }} />
                
                {uploadMethod === 'url' ? (
                  <TextField
                    name="image"
                    label="Image URL"
                    fullWidth
                    value={currentItem.image}
                    onChange={handleInputChange}
                    margin="dense"
                    helperText="Enter a URL for the item image"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <Box sx={fileUploadStyles.dropzone}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="raised-button-file"
                      type="file"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    <label htmlFor="raised-button-file" style={{ width: '100%', cursor: 'pointer' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="body1">
                          Drag and drop an image or click to browse
                        </Typography>
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<PhotoCameraIcon />}
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Select Image
                        </Button>
                      </Box>
                    </label>
                    {selectedFile && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </Typography>
                    )}
                  </Box>
                )}
                
                {/* Image Preview */}
                {(previewUrl || currentItem.image) && (
                  <Box sx={fileUploadStyles.preview}>
                    <Typography variant="subtitle2" gutterBottom>
                      Image Preview
                    </Typography>
                    <Box
                      component="img"
                      src={previewUrl || currentItem.image}
                      alt="Item preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: 1
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Preview+Unavailable';
                      }}
                    />
                    {selectedFile && (
                      <Typography variant="caption" color="text.secondary">
                        This image will be uploaded when you save
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RiceCurryManagement;
