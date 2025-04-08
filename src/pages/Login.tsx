import React, { FormEvent, useCallback, useState } from "react";
import { Box, Container, Typography, TextField, Button, Paper, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Link } from "react-router-dom";




import { useAuthStore } from "../store/useAuthStore";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from "react-router-dom";
import { getMessageError, mappingErrors } from "../mapping";
import { APIResponse, CallAPI, LoginResponse } from "../types";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    transition: "height 1s ease",
}));

export type LoginRequest = {
    username: string,
    password: string
}

const Login = () => {
    const [view, setView] = useState("login");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [loginRequest, setLoginRequest] = useState<LoginRequest>(
        {
            username: "",
            password: ""
        }
    );
    const { login } = useAuthStore();


    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setError(null);
        setLoginRequest(prevState => ({
            ...prevState,
            [name]: value
        }))

    }, [])

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response: CallAPI<APIResponse<LoginResponse>> = await login(loginRequest)
            console.log("🚀 ~ handleSubmit ~ response:", response)
            setLoading(false)
            if (response.data?.data?.authenticated && response.data.code === 1000) {
                navigate("/home")
            } if (response.error) {
                setError(getMessageError(response.error?.code))
            } else {
                setError("Lỗi không xác định");
            }
        }
        finally {
            setLoading(false)
        }

    };

    console.log(error);
    return (

        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "600px"
                }}
            >
                <StyledPaper elevation={3}>
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                        <SchoolIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        {view === "login" ? "Sign In" : "Reset Password"}
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={loginRequest.username}
                            onChange={handleChange}
                            disabled={loading}
                            InputProps={{
                                startAdornment: <PersonOutlineIcon />
                            }}
                            sx={{
                                "& .MuiInputBase-input": {
                                    padding: "16px"
                                }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            type="password"
                            label="password"
                            name="password"
                            disabled={loading}
                            autoComplete="password"
                            value={loginRequest.password}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <VpnKeyIcon />
                            }}
                            sx={{
                                "& .MuiInputBase-input": {
                                    padding: "16px"
                                }
                            }}
                        />
                        {error && <Typography sx={{ width: '100%', mb: 3, textAlign: "left", fontSize: '12px', color: "red" }}>
                            {error}
                        </Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onSubmit={handleSubmit}
                            loading={loading}
                        >
                            Login
                        </Button>

                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            {
                                <>
                                    <Button
                                        component={Link}
                                        to="/register"
                                    >
                                        Don't have an account? Sign Up
                                    </Button>
                                    <Button

                                        onClick={() => setView("forgot")}
                                    >
                                        Forgot password?
                                    </Button>
                                </>

                            }
                        </Box>
                    </Box>

                </StyledPaper>
            </Box>
        </Container>

    );
};

export default Login;