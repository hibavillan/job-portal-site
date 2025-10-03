import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Box, Chip, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobDetail = () => {
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setError('Job not found');
    }
  };

  const handleApply = async () => {
    try {
      await axios.post('http://localhost:5000/api/applications', { jobId: id });
      setSuccess('Application submitted successfully');
    } catch (err) {
      setError('Failed to apply');
    }
  };

  if (!job) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {job.employer.name} - {job.location}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Chip label={job.jobType} />
      </Box>
      <Typography variant="body1" paragraph>
        {job.description}
      </Typography>
      {job.requirements && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Requirements:</Typography>
          <ul>
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </Box>
      )}
      {user && user.role === 'job_seeker' && (
        <Button variant="contained" onClick={handleApply}>
          Apply for Job
        </Button>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Container>
  );
};

export default JobDetail;
