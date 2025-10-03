import React, { useState, useEffect, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    experience: '',
    location: '',
    company: '',
    website: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills?.join(', ') || '',
        experience: user.profile?.experience || '',
        location: user.profile?.location || '',
        company: user.profile?.company || '',
        website: user.profile?.website || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      await axios.put('http://localhost:5000/api/auth/me', data);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (!user) return <Typography>Please login</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Skills (comma separated)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={2}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          margin="normal"
        />
        {user.role === 'employer' && (
          <>
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              margin="normal"
            />
          </>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Update Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
