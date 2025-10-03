import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.role === 'employer') {
      fetchEmployerJobs();
    } else if (user?.role === 'job_seeker') {
      fetchApplications();
    }
  }, [user]);

  const fetchEmployerJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/employer/me');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/me');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <Typography>Please login</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      {user.role === 'employer' ? (
        <Box>
          <Button variant="contained" component={Link} to="/jobs/new" sx={{ mb: 2 }}>
            Post New Job
          </Button>
          <Typography variant="h5" gutterBottom>
            Your Job Listings
          </Typography>
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography color="textSecondary">{job.location}</Typography>
                    <Typography variant="body2">{job.description.substring(0, 100)}...</Typography>
                  </CardContent>
                  <Box sx={{ p: 1 }}>
                    <Button size="small" component={Link} to={`/jobs/edit/${job._id}`}>
                      Edit
                    </Button>
                    <Button size="small" component={Link} to={`/jobs/${job._id}`}>
                      View
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            Your Applications
          </Typography>
          <List>
            {applications.map((app) => (
              <ListItem key={app._id} divider>
                <ListItemText
                  primary={app.job.title}
                  secondary={`Status: ${app.status} | Applied: ${new Date(app.appliedAt).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
