import React, { useState, useEffect, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    jobType: '',
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: ''
  });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      const job = res.data;
      setFormData({
        title: job.title,
        description: job.description,
        requirements: job.requirements.join('\n'),
        location: job.location,
        jobType: job.jobType,
        salaryMin: job.salary?.min || '',
        salaryMax: job.salary?.max || '',
        applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : ''
      });
    } catch (err) {
      setError('Failed to load job');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        salary: {
          min: parseInt(formData.salaryMin),
          max: parseInt(formData.salaryMax)
        }
      };
      if (id) {
        await axios.put(`http://localhost:5000/api/jobs/${id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/jobs', data);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save job');
    }
  };

  if (user?.role !== 'employer') {
    return <Typography>Access denied</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Job' : 'Post New Job'}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          label="Requirements (one per line)"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Job Type</InputLabel>
          <Select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
          >
            <MenuItem value="full-time">Full-time</MenuItem>
            <MenuItem value="part-time">Part-time</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
            <MenuItem value="freelance">Freelance</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Min Salary"
            name="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Max Salary"
            name="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={handleChange}
            margin="normal"
          />
        </Box>
        <TextField
          fullWidth
          label="Application Deadline"
          name="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {id ? 'Update Job' : 'Post Job'}
        </Button>
      </Box>
    </Container>
  );
};

export default JobForm;
