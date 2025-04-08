import { Box, Card, CardContent, IconButton, styled, TextField } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { FormSubmit } from '../pages/profile'
import TextFieldSearch from './TextFieldSearch'


import WorkIcon from '@mui/icons-material/Work';
import { companiesSuggestions } from '../CONFIG'
// import * as yup from "yup";
import CloseIcon from '@mui/icons-material/Close';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { getHelperTextMessage } from '../utils/utils';
const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));


type ExperienceProps = {
    index: number,
    control: Control<FormSubmit>,
    register: UseFormRegister<FormSubmit>,
    errors: FieldErrors<FormSubmit>,
    handleRemove: (e: number) => void;

}
const Experience: React.FC<ExperienceProps> = ({ index, control, register, errors, handleRemove }) => {
    const firstRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (firstRef.current) {
            firstRef.current.focus();
        }
    }, [])

    return (
        <StyledCard >
            <CardContent sx={{ position: "relative" }}>
                <IconButton onClick={() => handleRemove(index)} sx={{ fontSize: "4px", margin: "4px", position: "absolute", right: "0", top: "0" }}>
                    <CloseIcon sx={{ fontSize: "16px" }} />
                </IconButton>
                <Controller name={`experiences.${index}.nameCompany`} control={control} render={
                    (({ field }) => (
                        <TextFieldSearch
                            inputRef={firstRef}
                            label="Company Name"
                            name='nameCompany'
                            margin='normal'
                            placeholder='Type your Company Name'
                            suggestions={companiesSuggestions}
                            inputText={field.value}
                            handleChange={field.onChange}
                            errors={errors.experiences?.[index]?.nameCompany}
                            autoFocus
                            icon={<WorkIcon />}
                        />
                    ))

                }>

                </Controller>
                <TextField
                    {...register(`experiences.${index}.position`)}
                    margin="normal"
                    fullWidth
                    label="Position"
                    placeholder='Type your position'
                    error={!!errors.experiences?.[index]?.position}
                    helperText={getHelperTextMessage(errors.experiences?.[index]?.position)}
                    sx={{
                        "& .MuiInputBase-input": {
                            padding: "16px"
                        }
                    }}
                    autoFocus={false}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box display="flex" mt={2} width={"100%"} justifyContent="flex-start" alignItems="center" gap={2}>
                        <Box >
                            <Controller name={`experiences.${index}.startDate`} control={control} render={
                                ({ field }) => (
                                    <DatePicker
                                        onChange={(date) => field.onChange(date)}
                                        label="Start Date"
                                        views={["year", "month"]}
                                        format="MM/YYYY"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.experiences?.[index]?.startDate,
                                                helperText: getHelperTextMessage(errors.experiences?.[index]?.startDate),
                                            }
                                        }}
                                    />
                                )
                            }>

                            </Controller>


                        </Box>
                        <Box>
                            <Controller name={`experiences.${index}.endDate`} control={control} render={
                                ({ field }) => (

                                    <DatePicker
                                        label="End Date"
                                        views={["year", "month"]}
                                        format="MM/YYYY"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.experiences?.[index]?.endDate,
                                                helperText: getHelperTextMessage(errors.experiences?.[index]?.endDate),
                                            }
                                        }}
                                        onChange={(value) => field.onChange(value)}
                                    />

                                )
                            }>

                            </Controller>

                        </Box>

                    </Box>

                </LocalizationProvider>

            </CardContent>
        </StyledCard >

    )
}



export default Experience