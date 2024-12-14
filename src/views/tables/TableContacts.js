/* eslint-disable padding-line-between-statements */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { getAllContact, deleteContact, updateContact } from 'src/pages/api/appConfig'; // Ensure updateContact is imported
import PaginationComponent from '../pagination/pagination';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentContact, setCurrentContact] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    objet: '',
    message: '',
    phone: ''
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getAllContact();
        setMessages(data);
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch contacts', error);
      }
    };

    fetchMessages();
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleOpenDeleteDialog = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleOpenUpdateDialog = (contact) => {
    setCurrentContact(contact);
    setFormData(contact);
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setCurrentContact(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      objet: '',
      message: '',
      phone: ''
    });
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteContact(itemToDelete);
        setMessages(messages.filter((message) => message._id !== itemToDelete));
        handleCloseDeleteDialog();
      } catch (error) {
        console.error('Failed to delete contact', error);
      }
    }
  };

  const handleUpdate = async () => {
    if (currentContact) {
      try {
        await updateContact(currentContact._id, formData);
        setMessages(messages.map((message) => (message._id === currentContact._id ? { ...message, ...formData } : message)));
        handleCloseUpdateDialog();
      } catch (error) {
        console.error('Failed to update contact', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div>
      <h2>Contact List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Objet</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message._id}>
                <TableCell>{message.firstName}</TableCell>
                <TableCell>{message.lastName}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.objet}</TableCell>
                <TableCell>{message.message}</TableCell>
                <TableCell>{message.phone}</TableCell>
                <TableCell>
                  <Button
                    
                    onClick={() => handleOpenUpdateDialog(message)}
                    
                  >
                    Edit
                  </Button>
                  <Button

                    onClick={() => handleOpenDeleteDialog(message._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this contact?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
      >
        <DialogTitle>Update Contact</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Objet"
            name="objet"
            value={formData.objet}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="secondary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MessageList;
