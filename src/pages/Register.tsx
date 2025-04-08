import React, { ReactNode, useCallback, useState } from "react";
import { Box, Container, Typography, TextField, Button, Paper, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Controller, useForm } from "react-hook-form";
import { useApi } from "../hooks/useApi";
import { ApiError, apiRequest, callApi } from "../utils/callApi";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import { Password } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessIcon from '@mui/icons-material/Business';
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    transition: "height 1s ease",
}));
// type WagePayment= 'DAY' | 'HOUR' | 'WEEK';
// type TypeTimeWork= 'PARTTIME' | 'FULLTIME';

// type Experience = {
//     nameCompany:string,
//     position :string,
//     startDate:dayjs.Dayjs,
//     endDate:dayjs.Dayjs,
// }


export type ErrorResponseApp = {
    code: number,
    message: string
}

export type UserRequest = {
    username: string,
    fullName: string,
    email: string,
    password: string
    phone: string,
    dob: Dayjs | null,
}
export type UserRequestMapping = {
    nameReq: keyof UserRequest,
    name: string,
    icon: ReactNode;
}
const requestNameMappingName: UserRequestMapping[] = [
    { nameReq: "fullName", name: "Full name", icon: <PermContactCalendarIcon /> },
    { nameReq: "username", name: "User name", icon: <PersonOutlineIcon /> },
    { nameReq: "password", name: "Password", icon: <VpnKeyIcon /> },
    { nameReq: "email", name: "Email", icon: <MailOutlineIcon /> },
    { nameReq: "phone", name: "Phone", icon: <LocalPhoneIcon /> },
]

const schemaRegister = yup.object().shape({
    username: yup.string().required("username là bắt buộc"),
    password: yup.string().required("Password là bắt buộc"),
    fullName: yup.string().required("Fullname  là bắt buộc"),
    email: yup.string().required("Email là bắt buộc"),
    phone: yup.string().required("Phone là bắt buộc"),
    dob: yup.mixed()
        .required("Ngày không được để trống")
        .test("is-valid-date", "Vui lòng chọn ngày hợp lệ", (value) => dayjs(value).isValid())
        .test("end-date-long", "User phải trên 18 tuổi", (value) => dayjs(value).isBefore(dayjs().subtract(18, "year"))),
})

type FormRegister = yup.InferType<typeof schemaRegister>;
const Register = () => {

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },


    } = useForm<FormRegister>({
        resolver: yupResolver(schemaRegister),
        mode: "onChange"
    });



    console.log("🚀 ~ Register ~ errors:", errors)
    const resolveSubmit = useCallback(async (data) => {

        console.log("🚀 ~ onSubmit ~ data:", data)
        try {
            const response = await callApi("POST", "/user/add", data);
            console.log("🚀 ~ onSubmit ~ response:", response)

            console.log("ok")


        }
        catch {
            console.log("Catch")
        }
    }, [])
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
                        <AcUnitIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Register
                    </Typography>


                    <Box component="form" onSubmit={handleSubmit(resolveSubmit)} sx={{ width: "100%" }}>

                        {
                            requestNameMappingName.map((e: UserRequestMapping) => {

                                return <TextField
                                    {...register(e.nameReq)}
                                    margin="normal"
                                    fullWidth
                                    label={e.name}
                                    autoComplete="name"
                                    autoFocus={e.nameReq == "fullName"}
                                    type={e.nameReq === "password" ? "password" : e.nameReq === "email" ? "email" : "text"}
                                    error={!!errors[e.nameReq]}
                                    helperText={errors[e.nameReq]?.message}
                                    sx={{
                                        "& .MuiInputBase-input": {
                                            padding: "16px"
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: e.icon,

                                    }}
                                />
                            })
                        }

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller control={control} name="dob" render={({ field }) => (
                                <Box sx={{ mt: "12px" }}>
                                    <DatePicker
                                        {...register("dob")}
                                        label="Day of birth"
                                        onChange={(e) => field.onChange(e?.format("YYYY-MM-DD"))}
                                        slotProps={{ textField: { fullWidth: true, error: !!errors.dob, helperText: errors.dob?.message } }}

                                    />

                                </Box>
                            )}>


                            </Controller>


                        </LocalizationProvider>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            register
                        </Button>

                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Button component={Link} to="/login" variant="contained">
                                Back to login
                            </Button>

                        </Box>
                    </Box>
                </StyledPaper>
            </Box>
        </Container>

    );
};

export default Register;