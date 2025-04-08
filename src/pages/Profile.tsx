import React, { useCallback, useMemo, useRef, useState } from "react";
import { Container, Typography, Avatar, Grid, Paper, Divider, List, ListItem, ListItemText, Card, CardContent, Button, Box, Stack, IconButton, Select, MenuItem, FormLabel, Checkbox, FormControlLabel, TextField, FormControl, InputLabel, SelectChangeEvent, FormHelperText, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useModalStore } from "../store/useModalStore";
import { useApi } from "../hooks/useApi";
import { APIResponse, CallAPI, ResponsePromise, TeacherResponse } from "../types";
import AddIcon from '@mui/icons-material/Add';
import Graduate from "../components/Graduate";
import dayjs, { Dayjs } from "dayjs";
import Experience from "../components/Experience";
import Certificate from "../components/Certificate";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MAX_FILE_SIZE, MAX_UPLOAD_FILE, MAXIMUM_CERTIFICATE, MAXIMUM_DESCRIPTION, MAXIMUM_EXPERIENCE, MAXIMUM_GRADUATE, MINIMUM_GRADUATE, MIXIMUM_DESCRIPTION, POST_API_CREATE_TEACHER, SUPPORTED_FORMATS, TYPE_TIME_WORK, typeTimeWork, WAGE_PAYMENTS, wagePayments } from "../CONFIG";
import { callApi } from "../utils/callApi";
import { ErrorResponseApp, UserRequest, UserRequestMapping } from "./Register";
import { callApiWithAuth } from "../utils/callApiWithAuth";
import { Description } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
const ProfileContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3)
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: "auto",
    marginBottom: theme.spacing(2)
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));

export type UserResponse = {
    username: string,
    email: string,
    fullName: string,
    avatar: string,
    dob: string,
    description: string,
    image: string,
    roles: RoleResponse[]
}

export type RoleResponse = {
    name: string,
    description: string,
    permissions: PermissionResponse[]
}
export type PermissionResponse = {
    name: string,
    description: string,
}

export type UniversityResponse = {

    code: string;

    name: string;

    alias: string;
}
export type UniversityRequest = Omit<UniversityResponse, "id">;

export type RequestGraduate = {
    university: UniversityRequest
    major: string;
    schoolYear: string;
    gpa: number;
    isComplete: boolean;
}

// export type FormGraduate = {
//     id: number
//     university: UniversityRequest
//     major: string;
//     startYear: string;
//     endYear: string;
//     gpa: number;
//     isComplete: boolean;
// }

export type RequestExperience = {
    id: number
    nameCompany: string;
    position: string;
    startDate: Dayjs;
    endDate: Dayjs;
}

export type RequestCertificate = {
    id: number
    trainingProgram: string;
    reference: string;
    issueDate: Dayjs;
    expiryDate: Dayjs;
}

const schemaGraduate = yup.object().shape({
    university: yup.object().shape({
        code: yup.string(),
        name: yup.string().required("Tên trường không được để trống"),
    }),
    major: yup.string().required("Chuyên ngành không được để trống"),
    gpa: yup.number().min(5, "GPA phải lớn hơn 5").max(10, "GPA phải nhỏ hơn 10").required("GPA không được để trống").typeError("GPA phải là số"),
    schoolYear: yup.string().matches(/^\d{4}-\d{4}$/, "Năm học phải có định dạng YYYY-YYYY").required(),
    isCompleted: yup.boolean().default(false)
})

const schemaCertificate = yup.object().shape({
    trainingProgram: yup.string().required("Tên chứng chỉ không được để trống"),
    reference: yup.string().required("Tổ chức chứng nhận không được để trống"),
    issueDate: yup.mixed()
        .required("Ngày không được để trống")
        .test("is-valid-date", "Vui lòng chọn ngày hợp lệ", (value) => dayjs(value).isValid())
        .test("not-future-day", "Không được chọn ngày tương lai", (value) => dayjs(value).isBefore(dayjs())),
    expiryDate: yup.mixed()
        .required("Ngày không được để trống")
        .test("is-valid-date", "Vui lòng chọn ngày hợp lệ", (value) => dayjs(value).isValid()),

})

const schemaExperience = yup.object().shape({
    nameCompany: yup.string().required("Tên công ty được để trống"),
    position: yup.string().required("Chuyên ngành không được để trống"),
    startDate: yup.mixed()
        .required("Ngày không được để trống")
        .test("is-valid-date", "Vui lòng chọn ngày hợp lệ", (value) => dayjs(value).isValid())
        .test("not-future-day", "Không được chọn ngày tương lai", (value) => dayjs(value).isBefore(dayjs())),
    endDate: yup.mixed()
        .required("Ngày không được để trống")
        .test("is-valid-date", "Vui lòng chọn ngày hợp lệ", (value) => dayjs(value).isValid())
        .test("end-date-long", "Phải kết thúc dưới 1 tháng, tính từ ngày hiện tại", (value) => dayjs(value).isBefore(dayjs().add(1, 'month'))),
})
const schemaForm = yup.object().shape({
    graduates: yup.array().of(schemaGraduate),
    experiences: yup.array().of(schemaExperience),
    certificates: yup.array().of(schemaCertificate),
});



export type FormSubmit = yup.InferType<typeof schemaForm>;
export type FormGraduate = yup.InferType<typeof schemaGraduate>;
export type FormExperience = yup.InferType<typeof schemaExperience>;
export type FormCertificate = yup.InferType<typeof schemaCertificate>;

const Profile = () => {

    const { openModal } = useModalStore();

    const teacherData = {
        username: "prof.smith",
        email: "smith@education.com",
        firstName: "John",
        lastName: "Smith",
        avatar: "/path/to/avatar.jpg",
        dob: "1980-05-15",
        description: "Experienced professor with over 15 years of teaching in Computer Science.",
        image: "/path/to/profile-image.jpg",
        graduates: [
            { degree: "Ph.D. in Computer Science", university: "MIT", year: "2005" },
            { degree: "M.Sc. in Software Engineering", university: "Stanford", year: "2000" }
        ],
        experiences: [
            { position: "Senior Professor", institution: "Harvard University", period: "2015-Present" },
            { position: "Associate Professor", institution: "Yale University", period: "2010-2015" }
        ],
        certificates: [
            { name: "Advanced Teaching Methods", issuer: "Education Board", year: "2018" },
            { name: "Digital Learning Expert", issuer: "Online Education Association", year: "2020" }
        ]
    };


    const { data: response, error, loading } = useApi<APIResponse<UserResponse>>("GET", "/user/info", {},)

    const isTeacher = useMemo(() => {
        return !!response?.data?.roles?.find(e => e.name == "TEACHER")
    }, [response])


    return (
        <ProfileContainer maxWidth="lg">

            <ProfilePaper elevation={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} textAlign="center">
                        <LargeAvatar src={response?.data?.avatar} alt={response?.data?.fullName} />
                        <Typography variant="h4" gutterBottom>
                            {response?.data?.fullName}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            {response?.data?.email}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            {response?.data?.dob}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>


                    {
                        <>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Education
                                </Typography>
                                {teacherData.graduates.map((grad, index) => (
                                    <StyledCard key={index}>
                                        <CardContent>
                                            <Typography variant="h6">{grad.degree}</Typography>
                                            <Typography color="textSecondary">{grad.university}</Typography>
                                            <Typography variant="body2">Year: {grad.year}</Typography>
                                        </CardContent>
                                    </StyledCard>
                                ))}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Experience
                                </Typography>
                                {teacherData.experiences.map((exp, index) => (
                                    <StyledCard key={index}>
                                        <CardContent>
                                            <Typography variant="h6">{exp.position}</Typography>
                                            <Typography color="textSecondary">{exp.institution}</Typography>
                                            <Typography variant="body2">{exp.period}</Typography>
                                        </CardContent>
                                    </StyledCard>
                                ))}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Certificates
                                </Typography>
                                {teacherData.certificates.map((cert, index) => (
                                    <StyledCard key={index}>
                                        <CardContent>
                                            <Typography variant="h6">{cert.name}</Typography>
                                            <Typography color="textSecondary">{cert.issuer}</Typography>
                                            <Typography variant="body2">Year: {cert.year}</Typography>
                                        </CardContent>
                                    </StyledCard>
                                ))}
                            </Grid>
                        </>
                    }
                    <Box display="flex" alignItems="center" gap={3} justifyContent="flex-end" width="100%">
                        <Button onClick={() => openModal(<AlertEditInfomationUser />)} variant="text" color="primary">Sửa thông tin</Button>
                        {isTeacher
                            ? <Button onClick={() => openModal(<AlertEducation />)} variant="text" color="primary">Tùy chỉnh Education</Button>
                            : <Button onClick={() => openModal(<AlertEducation />)} variant="contained">Chuyển thành giáo viên</Button>
                        }
                    </Box>
                </Grid>
            </ProfilePaper>

        </ProfileContainer>
    );
};



const AlertEducation = () => {
    const [isSwitch, setIsSwitch] = useState<boolean>(false);
    const [isInfomationTeacher, setIsInfomationTeacher] = useState<boolean>(false);

    // const [loading, setLoading] = useState<boolean>(false);

    // const {
    //     register,
    //     handleSubmit,
    //     control,
    //     formState: { errors },
    // } = useForm<FormSubmit>({
    //     resolver: yupResolver(schemaForm),
    //     defaultValues: { graduates: [{ university: { name: "", code: "" }, major: "", isCompleted: false, schoolYear: "", gpa: null, }], experiences: [], certificate: [] },
    //     mode: "onChange"
    // });


    // const [isConfirm, setIsConfirm] = useState(false);


    // const { fields: graduates, append, remove } = useFieldArray({
    //     control,
    //     name: "graduates",
    // });

    // const { fields: experiences, append: appendExperience, remove: removeExperience } = useFieldArray({
    //     control,
    //     name: "experiences",
    // });

    // const { fields: certificates, append: appendCertificates, remove: removeCertificate } = useFieldArray({
    //     control,
    //     name: "certificates",
    // });

    // const addUniversity = useCallback(() => {
    //     if (graduates.length < MAXIMUM_GRADUATE) {
    //         append({ university: { name: "", code: "" }, major: "", isCompleted: false, schoolYear: "", gpa: null, });
    //     }
    // }, [append, graduates.length])

    // const removeUniversity = useCallback((index: number) => {
    //     if (graduates.length > MINIMUM_GRADUATE) {
    //         remove(index)
    //     }
    // }, [graduates.length, remove])

    // const addExperience = useCallback(() => {
    //     if (experiences.length < MAXIMUM_EXPERIENCE) {
    //         appendExperience({ nameCompany: "", position: "", startDate: "", endDate: "" });
    //     }
    // }, [appendExperience, experiences.length])


    // const addCertificate = useCallback(() => {
    //     if (certificates.length < MAXIMUM_CERTIFICATE) {
    //         appendCertificates({ trainingProgram: "", reference: "", expiryDate: "", issueDate: "" })
    //     }
    // }, [certificates.length, appendCertificates])


    // const resolveSubmit = useCallback(async (data: FormSubmit) => {


    //     try {
    //         setLoading(true);
    //         const dataPromise = await callApi("POST", POST_API_CREATE_TEACHER, data);
    //         console.log("🚀 ~ resolveSubmit ~ dataPromise:", dataPromise)

    //     } catch (error: unknown) {

    //         const dataResponse = error as ErrorResponseApp;
    //         console.log("🚀 ~ resolveSubmit ~ dataResponse:", dataResponse)

    //     } finally {
    //         setLoading(false);
    //     }


    // }, []);

    // const switchToTeacher = useCallback(async () => {
    //     try {

    //         const dataPromise = await callApiWithAuth("POST", POST_API_CREATE_TEACHER, {});
    //         console.log("🚀 ~ resolveSubmit ~ dataPromise:", dataPromise)

    //     } catch (error: unknown) {
    //         const dataResponse = error as ErrorResponseApp;
    //         console.log("🚀 ~ resolveSubmit ~ dataResponse:", dataResponse)
    //     }

    // }, []);

    return (
        <Stack p={4} >
            {isInfomationTeacher
                ?
                <Typography color="textSecondary" variant="h4" textAlign="center" fontWeight="bold" marginBottom="8px">Board Information</Typography>
                :
                <>
                    <Typography variant="h6">Are you want to be teacher ? </Typography>
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={3}>
                        <Button>Cancel</Button>
                        <Button variant="contained" onClick={() => setIsInfomationTeacher(!isInfomationTeacher)} color="primary">Yes</Button>
                    </Box>
                </>
            }
            {/* 
            {isSwitch && <Box component="form" onSubmit={handleSubmit(resolveSubmit)}>

                <Grid item xs={12}>
                    <Box display='flex' justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" gutterBottom>
                            Education
                        </Typography>
                        <IconButton onClick={addUniversity}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {graduates.map((grad, index) => (
                        <Graduate
                            key={index}
                            index={index}
                            control={control}
                            register={register}
                            requestGraduate={grad}
                            errors={errors}
                            handleRemove={removeUniversity} />
                    ))}
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    <Box display='flex' justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" gutterBottom>
                            Experience
                        </Typography>
                        <IconButton onClick={addExperience}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {experiences.map((_exp, index) => (
                        <Experience
                            key={index}
                            index={index}
                            control={control}
                            register={register}
                            errors={errors}
                            handleRemove={removeExperience} />
                    ))}
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    <Box display='flex' justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" gutterBottom>
                            Certificate
                        </Typography>
                        <IconButton onClick={addCertificate}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {certificates.map((_cert, index) => (
                        <Certificate
                            key={index}
                            index={index}
                            control={control}
                            register={register}
                            errors={errors}
                            handleRemove={removeCertificate} />
                    ))}
                </Grid>
                <FormControlLabel
                    control={<Checkbox onClick={() => setIsConfirm(!isConfirm)} />}
                    checked={isConfirm}
                    label={<Typography color='textSecondary'>Tôi xác nhận rằng tôi đã đọc và đồng ý với các <a target="blank" href="https://www.facebook.com/ga.con.3011/">điều khoản sử dụng</a>. </Typography>}
                />


                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Button >Cancel</Button>

                    <Button loading={loading} variant="contained" type="submit" disabled={!isConfirm}>Agree</Button>
                </Box>
            </Box>} */}

            {
                isInfomationTeacher && <AlertInfomationTeacher />
            }
        </Stack>

    )

}
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    transition: "height 1s ease",
}));

const AlertEditInfomationUser = () => {

    const [formData, setFormData] = useState<UserRequest>({
        username: "",
        fullName: "",
        dob: dayjs(),  // Giá trị mặc định là `dayjs()`
        email: "",
        password: ""
    });
    const { data: response, error, loading } = useApi<APIResponse<UserResponse>>("GET", "/user/info", {},)
    console.log("🚀 ~ AlertEditInfomationUser ~ response:", response)

    const { closeModal } = useModalStore();

    const teacherData = {
        district: "Bình Tân",
        city: "TP.HCM",
    };



    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        console.log(name, value);
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const handleDateChange = useCallback((
        name: string,
        value: Dayjs | null,
    ) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);


        const userRequestFormatted = {
            ...formData,
            dob: formData.dob ? formData.dob.format("YYYY-MM-DD") : null, // Chuyển thành chuỗi
        };
        console.log(userRequestFormatted)
        try {
            const dataPromise = await callApi("POST", "/user/add", userRequestFormatted)
            console.log("Response:", dataPromise);
            setSuccess(true);
        } catch (error: unknown) {

            const dataResponse = error as ErrorResponseApp;
            setError(dataResponse)
        } finally {
            setLoading(false);
        }


    };
    return (

        <StyledPaper elevation={3} sx={{ maxWidth: "500px" }}>

            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                Thông tin User
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <Grid item xs={12} textAlign="center">
                    <LargeAvatar src={response?.data?.avatar} alt={response?.data?.fullName} />
                    <Typography variant="h4" gutterBottom>
                        {response?.data?.fullName}
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker
                            label="Day of birth"
                            value={formData.dob}
                            onChange={(value) => handleDateChange("dob", value)}
                            slotProps={{}}
                            sx={{ display: "none" }}
                        />


                    </LocalizationProvider>
                    <Typography variant="subtitle2" color="textSecondary">
                        {response?.data?.dob}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>



                <Grid item xs={12} mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Địa chỉ
                    </Typography>

                    <StyledCard>
                        <CardContent>
                            <Typography color="textSecondary">{teacherData.city}, {teacherData.district}</Typography>

                        </CardContent>
                    </StyledCard>

                </Grid>


                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Update
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                    onClick={closeModal}
                >
                    Cancel
                </Button>

            </Box>
        </StyledPaper>

    )
}


const schemaInfomationTeacher = yup.object().shape({
    description: yup.string().required("Mô tả không được để trống").min(MIXIMUM_DESCRIPTION).max(MAXIMUM_DESCRIPTION),
    typeTimeWork: yup.string().required("Type Time Work không được để trống"),
    wagePayments: yup.string().required("Wage Payments không được để trống"),

})


type InfomationTeacherForm = yup.InferType<typeof schemaInfomationTeacher>


const AlertInfomationTeacher = () => {
    // const fileInputRef = useRef<HTMLInputElement>(null);
    // const handleButtonClick = () => {
    //     fileInputRef.current?.click();
    // };
    // const [files, setFiles] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm<InfomationTeacherForm>({
        resolver: yupResolver(schemaInfomationTeacher),
        mode: "onChange"
    });

    console.log("🚀 ~ AlertInfomationTeacher ~ errors:", errors)



    // const validateFiles = useMemo(() => {
    //     console.log("Total", files.reduce((prev, cur) => (cur.size + prev), 0) / 1024 / 1024)
    //     if (files?.length == 0) {
    //         return { validate: false, message: "Phải có ít nhất một ảnh" };
    //     }
    //     else if (files.length > 10) {
    //         return { validate: false, message: "Số ảnh tối đa là 10" }
    //     }
    //     else if (!files.every(e => e.size < MAX_FILE_SIZE)) {
    //         return { validate: false, message: "Mối ảnh tải lên không quá 4MB" }
    //     }
    //     else if (files.reduce((prev, cur) => (cur.size + prev), 0) > MAX_UPLOAD_FILE) {
    //         return { validate: false, message: "Tổng dung lượng các ảnh là 10MB" }
    //     }
    //     return { validate: true, message: "" }

    // }, [(files)])
    // console.log("🚀 ~ validateFiles ~ validateFiles:", validateFiles)


    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files;
    //     if (files && files.length > 0) {
    //         const filesArray = Array.from(files);
    //         setFiles(filesArray)
    //     }
    // };

    const resolveSubmit = useCallback(async (data) => {
        // setHaveSubmit(true)
        // if (validateFiles.validate) {

        // }
        const response: CallAPI<APIResponse<TeacherResponse>> = await callApiWithAuth("POST", "/teacher/add", data,)
        console.log("🚀 ~ resolveSubmit ~ response:", response)
        console.log("DA SUBMIT INFOMATION", data);
    }, [])
    return (
        <Stack gap={4} mt={3} component="form" onSubmit={handleSubmit(resolveSubmit)}>
            <TextField
                {...register("description")}
                label="Description"
                placeholder="Wrire something your self"
                multiline
                rows={6}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
                variant="outlined"
            />

            <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label">Type Timework</InputLabel>
                <Select
                    {...register("typeTimeWork")}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type Timework"
                    error={!!errors.typeTimeWork}
                >
                    {TYPE_TIME_WORK.map(e => <MenuItem value={e}>{e}</MenuItem>)}
                </Select>
                <FormHelperText sx={{ color: "red" }}>{errors.typeTimeWork?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Wage Payment</InputLabel>
                <Select
                    {...register("wagePayments")}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Wage Payment"
                    error={!!errors.wagePayments}
                >
                    {WAGE_PAYMENTS.map(e => <MenuItem value={e}>{e}</MenuItem>)}
                </Select>
                <FormHelperText sx={{ color: "red" }}>{errors.wagePayments?.message}</FormHelperText>
            </FormControl>


            {/* <Box display="flex" alignItems="center" gap={3}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    multiple
                />
                <Button variant="contained" onClick={handleButtonClick}>
                    Choose File
                </Button>
                {(haveSubmit && !validateFiles.validate) && <Typography color="red">
                    {validateFiles.message}
                </Typography>}

            </Box>
            <Box>
                {files && files.map(e => <Typography color={(e.size > MAX_FILE_SIZE) && haveSubmit ? "red" : "textSecondary"}>{e.name} {(e.size > MAX_FILE_SIZE && haveSubmit) ? `(${(e.size / 1024 / 1024).toFixed(2)} MB)` : ""}</Typography>)}
            </Box> */}
            <Box display="flex" alignItems="center" justifyContent="end">
                <Button>Cancel</Button>
                <Button type="submit" onClick={() => setHaveSubmit(true)}>Agree</Button>
            </Box>
        </Stack >
    )
}


export default Profile;