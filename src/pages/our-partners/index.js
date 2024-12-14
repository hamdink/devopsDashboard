import { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  Button,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import RequireAdmin from 'src/@core/layouts/components/RequireAdmin';
import PartnerDataModal from 'src/views/modals/partnerModal';
import { deletePartner, getPartners } from '../api/appConfig';

const OurPartners = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState('');

  const [formData, setFormData] = useState({
    partners: []
  });

  async function fetchData() {
    const response = await getPartners();
    if (response) {
      setFormData({ partners: [...response] });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async partnerData => {
    if (selectedPartner) {
      const updatedPartners = [...formData.partners];
      const indexToUpdate = formData.partners.findIndex(p => p._id === selectedPartner._id);
      updatedPartners[indexToUpdate] = partnerData;
      setFormData({ partners: updatedPartners });
    } else {
      setFormData(prev => ({
        ...prev,
        partners: [...prev.partners, partnerData]
      }));
    }
    setModalOpen(false);
    setSelectedPartner(null);
    await fetchData(); // Re-fetch data to ensure updates are reflected
  };

  const handleDeletePartner = id => {
    setSectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    await deletePartner(sectionToDelete);
    await fetchData();
    setSectionToDelete('');
    setDeleteDialogOpen(false);
  };

  const handleEditPartner = partner => {
    setSelectedPartner(partner);
    setModalOpen(true);
  };

  return (
    <RequireAdmin>
      <div style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ paddingBottom: 10 }}>
            <Typography variant='h5'>Our Partners Section</Typography>
          </Grid>
          <Card style={{ width: '100%' }}>
            <CardHeader title='Our Partners Creation Interface' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setSelectedPartner(null);
                  setModalOpen(true);
                }}
              >
                Add New Partner
              </Button>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>BlackImage</TableCell>
                    <TableCell>ColorImage</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.partners.map((partner, index) => (
                    <TableRow key={index}>
                      <TableCell
                        style={{
                          maxWidth: '150px',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {partner.name}
                      </TableCell>
                      <TableCell>
                        <img src={partner.imageBlack} alt='Partner' style={{ width: '50px', height: '50px' }} />
                      </TableCell>
                      <TableCell>
                        <img src={partner.imageColor} alt='Partner' style={{ width: '50px', height: '50px' }} />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditPartner(partner)}>Edit</Button>
                        <Button onClick={() => handleDeletePartner(partner._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <PartnerDataModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
            data={selectedPartner}
            fetchData={fetchData}
          />
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDelete} color='secondary'>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </div>
    </RequireAdmin>
  );
};

export default OurPartners;
