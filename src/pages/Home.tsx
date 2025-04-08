import { ThemeProvider } from '@emotion/react';
import { Autocomplete, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, styled, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'

import AddIcon from '@mui/icons-material/Add';
import { useThemeStore } from '../store/themeStore';
import { CardPost } from '../components/CardPost';
import { useAuthStore } from '../store/useAuthStore';
import { useApi } from '../hooks/useApi';



const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4]
  }
}));

export type PostProps = {
  id: number,
  title: string,
  company: string,
  location: string,
  type: string,
  salary: string,
  logo: string,
  description: string

}

const dummyJobs = [
  {
    id: 1,
    title: "Nguyễn Văn A",
    company: "Giáo viên toán",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea",
    description: "We are looking for best company"
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignHub",
    location: "New York, NY",
    type: "Remote",
    salary: "$90,000 - $120,000",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea",
    description: "Join our creative team as a UX Designer..."
  }
];
const jobCategories = ["TP.HCM", "Hà Nội", "Đà Nẵng", "Thanh Hóa", "Vũng Tàu"];
export const Home = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [jobs, setJobs] = useState<PostProps[]>([]);

  const [selectedJob, setSelectedJob] = useState<PostProps>();
  const [openDialog, setOpenDialog] = useState(false);
  // const [salaryRange, setSalaryRange] = useState([30000, 150000]);




  const { data, error, loading } = useApi("GET", "/user/info", {},)


  console.log("HIHIHI", data, error, loading)



  useEffect(() => {

    setJobs(dummyJobs);


  }, []);



  return (

    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Switch
            checked={theme == "light" ? false : true}
            onChange={toggleTheme}
            icon={<AddIcon />}
            checkedIcon={<AddIcon />}
          />
        </Box>

        <Typography variant="h2" color='primary' component="h1" gutterBottom align="center">
          Tìm Giáo Viên
        </Typography>

        <Box sx={{ my: 4 }}>
          <Autocomplete
            freeSolo
            options={["React Developer", "UX Designer", "Product Manager"]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Jobs"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <AddIcon />
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={1}>
            {jobCategories.map((category) => (
              <Grid item key={category}>
                <Chip color='secondary' label={category} clickable />
              </Grid>
            ))}
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} gap={3}>
            {jobs.map((job) => (
              // <Grid item xs={12} sm={6} md={4} key={job.id}>
              //   <StyledCard onClick={() => handleJobClick(job)}>
              //     <CardContent>
              //       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              //         <Avatar src={job.logo} alt={job.company} />
              //         <Box sx={{ ml: 2 }}>
              //           <Typography variant="h6">{job.title}</Typography>
              //           <Typography color="textSecondary">{job.company}</Typography>
              //         </Box>
              //       </Box>
              //       <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              //         <AddIcon />
              //         <Typography sx={{ ml: 1 }}>{job.location}</Typography>
              //       </Box>
              //       <Box sx={{ display: "flex", alignItems: "center" }}>
              //         <AddIcon />
              //         <Typography sx={{ ml: 1 }}>{job.salary}</Typography>
              //       </Box>
              //       <Box sx={{ mt: 2 }}>
              //         <Chip label={job.type} size="small" />
              //       </Box>
              //     </CardContent>
              //   </StyledCard>
              // </Grid>
              <CardPost post={job} />
            ))}
          </Grid>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          {selectedJob && (
            <>
              <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" color='primary'>{selectedJob.title}</Typography>
                  <Box>
                    <IconButton>
                      <AddIcon />
                    </IconButton>
                    <IconButton>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <Typography color='secondary' variant="body1">{selectedJob.description}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="textSecondary">
                    {selectedJob.location} • {selectedJob.type}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedJob.salary}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
                <Button variant="contained" color="primary">
                  Apply Now
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>

  )
}
