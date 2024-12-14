/* eslint-disable padding-line-between-statements */
import React, { useState, useEffect } from 'react'
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
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material'
import RequireAdmin from 'src/@core/layouts/components/RequireAdmin'
import WhatWeDoDataModal from 'src/views/modals/whatWeDoModal'
import { deleteActivity, getActivities } from '../api/appConfig'

const CardBasic = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState('')
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [activityToView, setActivityToView] = useState(null)

  const [formData, setFormData] = useState({
    activities: []
  })
  const fetchData = async () => {
    try {
      const response = await getActivities()
      if (response) {
        setFormData({ activities: [...response] })
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = activityData=> {
    if (selectedActivity) {
      const updatedActivities = [...formData.activities]
      const indexToUpdate = formData.activities.findIndex(m => m === selectedActivity)
      updatedActivities[indexToUpdate] = activityData
      setFormData({ activities: updatedActivities })
    } else {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activityData]
      }))
    }
    setModalOpen(false)
    setSelectedActivity(null)
  }

 /*  const handleSubmit = async activityData => {
    try {
      if (selectedActivity) {
        // Update existing activity
        const updatedActivities = formData.activities.map(activity =>
          activity._id === selectedActivity._id ? activityData : activity
        )
        setFormData({ activities: updatedActivities })
      } else {
        // Add new activity
        setFormData(prev => ({
          ...prev,
          activities: [...prev.activities, activityData]
        }))
      }
      setModalOpen(false)
      setSelectedActivity(null)
    } catch (error) {
      console.error('Error handling submit:', error)
    }
  }
 */
  const handleDeleteActivity = id => {
    setActivityToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    try {
      await deleteActivity(activityToDelete)
      await fetchData()
      setActivityToDelete('')
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  const handleEditActivity = activity => {
    setSelectedActivity(activity)
    setModalOpen(true)
  }
console.log(formData)

  return (
    <RequireAdmin>
      <div style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ paddingBottom: 10 }}>
            <Typography variant='h5'>Our Services</Typography>
          </Grid>
          <Card style={{ width: '100%' }}>
            <CardHeader title='Our Services Interface' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setSelectedActivity(null)
                  setModalOpen(true)
                }}
                sx={{ mr: 2 }}
              >
                Add New Service
              </Button>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Language</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.activities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{activity.description}</TableCell>
                      <TableCell>
                        <img src={activity.image} alt='Activity' style={{ width: '50px', height: '50px' }} />
                      </TableCell>
                      <TableCell>{activity.language === 'fr' ? 'French' : 'English'}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditActivity(activity)}>Edit</Button>
                        <Button onClick={() => handleDeleteActivity(activity._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <WhatWeDoDataModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false)
              setSelectedActivity(null)
            }}
            onSubmit={handleSubmit}
            data={selectedActivity}
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
          <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
            <DialogTitle>Activity Details</DialogTitle>

            <DialogActions>
              <Button onClick={() => setViewModalOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </div>
    </RequireAdmin>
  )
}

export default CardBasic
