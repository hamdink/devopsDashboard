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
import { addPartner, updatePartner } from 'src/pages/api/appConfig'

const PartnerDataModal = ({ open, onClose, onSubmit, data, fetchData }) => {
  const [formData, setFormData] = useState({
  
    name: '',
    imageBlack: null,
    imageColor: null,
    imageUrlBlack: '',
    imageUrlColor: ''
  })

  useEffect(() => {
    if (data) {
      /* setFormData({ ...data, imageUrl: data.image, language: data.language || 'en' }) */
      setFormData({ ...data, imageUrl: data.image})
    } else {
      setFormData({
       
        name: '',
        image: null,
        imageUrl: ''
      
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

  const handleImageColorChange = e => {
    const imageFile = e.target.files[0]
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setFormData(prev => ({ ...prev, imageColor: imageFile, imageUrlColor: imageUrl }))
    }
  }
  // eslint-disable-next-line padding-line-between-statements
  const handleImageBlackChange = e => {
    const imageFile = e.target.files[0]
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setFormData(prev => ({ ...prev, imageBlack: imageFile, imageUrlBlack: imageUrl }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { imageBlack,name,imageColor } = formData
    if (!data) {
      await addPartner({
       
        imageBlack,
        imageColor,
        name/* ,
        description,
        language */
      })
      await fetchData()
      onClose()
    } else {
      await updatePartner(data._id, {
        imageBlack,
        imageColor,
        name/* ,
        description,
        language */
      })
      await fetchData()
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='sm'>
      <DialogTitle>{data ? 'Update Partner' : 'Add Partner'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
         {/*  <Box marginTop={3} marginBottom={2}>
            <TextField
              fullWidth
              label='Description'
              name='description'
              value={formData.description}
              onChange={handleFormChange}
            />
          </Box>

          <Box marginBottom={2}>
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
            <Box marginTop={3} marginBottom={2}>
            <TextField
              fullWidth
              label='Name'
              name='name'
              value={formData.name}
              onChange={handleFormChange}
            />
          </Box>

          <Box marginBottom={2}>
            <Input type='file' name='imageBlack' accept='image/*'  placeholder='Black Image' onChange={handleImageBlackChange} />
            {formData.imageUrlBlack && (
              <img src={formData.imageUrlBlack} alt='Preview' style={{ width: '50px', height: '50px', marginTop: '10px' }} />
            )}
          </Box>
          <Box marginBottom={2}>
     
            <Input type='file' name='imageColor' accept='image/*' placeholder='Color Image' onChange={handleImageColorChange} />
            {formData.imageUrlColor && (
              <img src={formData.imageUrlColor} alt='Preview' style={{ width: '50px', height: '50px', marginTop: '10px' }} />
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

export default PartnerDataModal
