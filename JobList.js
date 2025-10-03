import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [search, location, jobType]);

  const fetchJobs = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      const res = await axios.get('http://localhost:5000/api/jobs', { params });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Listings
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Job Type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {job.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {job.employer.name} - {job.location}
                </Typography>
                <Typography variant="body2" component="p">
                  {job.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={job.jobType} size="small" />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/jobs/${job._id}`}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default JobList;
