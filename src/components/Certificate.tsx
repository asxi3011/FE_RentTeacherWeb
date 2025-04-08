import { Box, Card, CardContent, IconButton, styled, TextField } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { FormSubmit } from '../pages/profile'
import TextFieldSearch from './TextFieldSearch'

import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import { certificatesSuggestions } from '../CONFIG'
// import * as yup from "yup";
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { getHelperTextMessage } from '../utils/utils';
const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));


type CertificateProps = {
    index: number,
    control: Control<FormSubmit>,
    register: UseFormRegister<FormSubmit>,
    errors: FieldErrors<FormSubmit>,
    handleRemove: (e: number) => void;
}
const Certificate: React.FC<CertificateProps> = ({ index, control, register, errors, handleRemove }) => {

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
                <Controller name={`certificates.${index}.trainingProgram`} control={control} render={({ field }) => (
                    <TextFieldSearch
                        inputRef={firstRef}
                        label="Training Program"
                        autoFocus
                        margin='normal'
                        placeholder='Type your Training Program'
                        suggestions={certificatesSuggestions}
                        inputText={field.value}
                        errors={errors.certificates?.[index]?.trainingProgram}
                        handleChange={field.onChange}
                        icon={<WorkspacePremiumIcon />} />
                )}>


                </Controller>
                <TextField
                    error={!!errors.certificates?.[index]?.reference}
                    helperText={getHelperTextMessage(errors.certificates?.[index]?.reference)}
                    margin="normal"
                    fullWidth
                    label="Reference"
                    placeholder='Type your Reference'
                    {...register(`certificates.${index}.reference`)}
                    sx={{
                        "& .MuiInputBase-input": {
                            padding: "16px"
                        }
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box display="flex" mt={2} width={"100%"} justifyContent="flex-start" alignItems="center" gap={2}>
                        <Box >
                            <Controller name={`certificates.${index}.issueDate`} control={control} render={({ field }) => (
                                <DatePicker
                                    label="Issue Date"
                                    views={["year", "month"]}
                                    format="MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.certificates?.[index]?.issueDate,
                                            helperText: getHelperTextMessage(errors.certificates?.[index]?.issueDate)
                                        }
                                    }}
                                    onChange={(value) => field.onChange(value)}
                                />
                            )}>
                            </Controller>
                        </Box>
                        -
                        <Box >
                            <Controller name={`certificates.${index}.expiryDate`} control={control} render={({ field }) => (
                                <DatePicker
                                    label="Expiry Date"
                                    views={["year", "month"]}
                                    format="MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.certificates?.[index]?.expiryDate,
                                            helperText: getHelperTextMessage(errors.certificates?.[index]?.expiryDate)
                                        }
                                    }}
                                    onChange={(value) => field.onChange(value)}
                                />
                            )}>
                            </Controller>

                        </Box>

                    </Box>
                </LocalizationProvider>





            </CardContent>
        </StyledCard>

    )
}



export default Certificate