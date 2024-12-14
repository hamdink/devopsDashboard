import { useEffect, useState } from 'react'
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
} from '@mui/material'
import RequireAdmin from 'src/@core/layouts/components/RequireAdmin'
import TeamMemberModal from 'src/views/modals/teamMemberModal'
import { deleteTeamMember, getTeamMembers } from '../api/appConfig'

const LeadershipTeam = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [sectionToDelete, setSectionToDelete] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    teamMembers: []
  })
  async function fetchData() {
    const response = await getTeamMembers()
    if (response) {
      console.log('Data fetched:', response)

      setFormData({ teamMembers: [...response] })
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = memberData => {
    if (selectedMember) {
      const updatedMembers = [...formData.teamMembers]
      const indexToUpdate = formData.teamMembers.findIndex(m => m === selectedMember)
      updatedMembers[indexToUpdate] = memberData
      setFormData({ teamMembers: updatedMembers })
    } else {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, memberData]
      }))
    }
    setModalOpen(false)
    setSelectedMember(null)
  }

  const handleDeleteMember = id => {
    setSectionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    await deleteTeamMember(sectionToDelete)
    await fetchData()
    setSectionToDelete('')
    setDeleteDialogOpen(false)
  }

  const handleEditMember = member => {
    setSelectedMember(member)
    setModalOpen(true)
  }

  return (
    <RequireAdmin>
      <div style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ paddingBottom: 10 }}>
            <Typography variant='h5'>Leadership Team Section</Typography>
          </Grid>
          <Card style={{ width: '100%' }}>
            <CardHeader title='Leadership Team Creation Interface' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setSelectedMember(null)
                  setModalOpen(true)
                }}
              >
                Add New Team Member
              </Button>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Linkedin</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.teamMembers.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.fullName}</TableCell>
                      <TableCell
                        style={{
                          maxWidth: '150px',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {member.linkedinLink}
                      </TableCell>
                      <TableCell
                        style={{
                          maxWidth: '150px',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {member.email}
                      </TableCell>

                      <TableCell>
                        <img src={member.image} alt='Team Member' style={{ width: '50px', height: '50px' }} />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditMember(member)}>Edit</Button>
                        <Button onClick={() => handleDeleteMember(member._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <TeamMemberModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
            data={selectedMember}
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
  )
}

export default LeadershipTeam