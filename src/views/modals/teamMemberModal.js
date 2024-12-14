import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Input,
  Select,
  MenuItem
} from '@mui/material'
import { addTeamMember, updateTeamMember } from 'src/pages/api/appConfig'

const TeamMemberModal = ({ open, onClose, onSubmit, data, fetchData }) => {
  const [formData, setFormData] = useState({
    position: '',
    fullName: '',
    image: null,
    imageUrl: '',
    linkedinLink: '',
    email: '',
  })

  useEffect(() => {
    if (data) {
      setFormData({ ...data, imageUrl: data.image/* , language: data.language || 'en' */ })
    } else {
      setFormData({
        position: '',
        fullName: '',
        image: null,
        imageUrl: '',
        linkedinLink: '',
        email: '',
      })
    }
  }, [data])

  const handleFormChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

 /*  const handleLanguageChange = event => {
    const { value } = event.target
    setFormData(prev => ({ ...prev, language: value }))
  } */

  const handleImageChange = e => {
    const imageFile = e.target.files[0]
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setFormData(prev => ({ ...prev, image: imageFile, imageUrl }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { image, position, fullName,linkedinLink,email/* , language  */} = formData
    if (!data) {
      await addTeamMember({
        image,
        position,
        fullName,
        linkedinLink,
        email
      })
      await fetchData()
      onClose()
    } else {
      await updateTeamMember(data._id, {
        image,
        position,
        fullName,
        linkedinLink,
        email
      })
      await fetchData()
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='md'>
      <DialogTitle>{data ? 'Update Team Member' : 'Add Team Member'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box marginTop={3} marginBottom={2}>
            <TextField
              fullWidth
              label='Position'
              name='position'
              value={formData.position}
              onChange={handleFormChange}
            />
          </Box>
          <Box marginBottom={2}>
            <TextField fullWidth label='Name' name='fullName' value={formData.fullName} onChange={handleFormChange} />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label='Linkedin'
              name='linkedinLink'
              multiline
              rows={2}
              value={formData.linkedinLink}
              onChange={handleFormChange}
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label='Email'
              name='email'
              multiline
              rows={2}
              value={formData.email}
              onChange={handleFormChange}
            />
          </Box>
         {/*  <Box marginBottom={2}>
            <Select
              labelId='language-selector-label'
              id='language-selector'
              value={formData.language}
              onChange={handleLanguageChange}
              fullWidth
            >
              <MenuItem value='en'>English</MenuItem>
              <MenuItem value='fr'>French</MenuItem>
            </Select>
          </Box> */}

          <Box marginBottom={2}>
            <Input type='file' name='image' accept='image/*' onChange={handleImageChange} />
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt='Preview' style={{ width: '50px', height: '50px', marginTop: '10px' }} />
            )}
          </Box>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='submit'>{data ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TeamMemberModal
