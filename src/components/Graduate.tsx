import { Card, CardContent, Checkbox, FormControlLabel, IconButton, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo, useRef } from 'react'
import { useApi } from '../hooks/useApi'
import { APIResponse } from '../types'
import { FormGraduate, FormSubmit, UniversityResponse } from '../pages/profile'
import TextFieldSearch from './TextFieldSearch'
import { convertToAlias, detachUniversity, getHelperTextMessage } from '../utils/utils'
import SearchIcon from '@mui/icons-material/Search';
import { suggestionsMajor } from '../CONFIG'
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import { Control, Controller, FieldErrors, UseFormRegister, } from 'react-hook-form'

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));


type GraduateProps = {
    requestGraduate: FormGraduate,
    index: number,
    control: Control<FormSubmit>,
    register: UseFormRegister<FormSubmit>,
    errors: FieldErrors<FormSubmit>,
    handleRemove: (e: number | undefined) => void;
}

const Graduate: React.FC<GraduateProps> = ({ requestGraduate, index, control, register, errors, handleRemove }) => {

    const { data: response, loading } = useApi<APIResponse<UniversityResponse[]>>("GET", "/university/getUniversitiesOnline", {},)

    const firstRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (firstRef.current) {
            firstRef.current.focus();
        }
    }, [])
    const suggestions = useMemo(() => {
        if (response?.code == 1000) {
            const suggestHaveUnicode = response.data.filter(univeristy => univeristy.name.toLowerCase().includes(requestGraduate.university.name.toLowerCase()));
            const suggestAlias = response.data.filter(univeristy => univeristy.alias.toLowerCase().includes(convertToAlias(requestGraduate.university.name.toLowerCase())));
            const suggestCode = response.data.filter(univeristy => univeristy.code.toLowerCase().includes(requestGraduate.university.name.toLowerCase()));
            return [...new Set([...suggestHaveUnicode, ...suggestAlias, ...suggestCode])].map(e => `${e.name} - ${e.code}`)
        } else {
            return []
        }
    }
        , [response, requestGraduate.university.name])


    return (
        <StyledCard >



            <CardContent sx={{ position: "relative" }}>

                <IconButton onClick={() => handleRemove(index)} sx={{ fontSize: "4px", margin: "4px", position: "absolute", right: "0", top: "0" }}>
                    <CloseIcon sx={{ fontSize: "16px" }} />
                </IconButton>
                <Controller name={`graduates.${index}.university`} control={control} render={({ field }) => (
                    <TextFieldSearch
                        label="University"
                        inputRef={firstRef}
                        name='university'
                        margin='normal'
                        placeholder='Type your code school or name school'
                        suggestions={suggestions}
                        inputText={field.value.name}
                        errors={errors.graduates?.[index]?.university?.name}
                        handleChange={(value: string) => {
                            const { name } = detachUniversity(value);
                            const univeristy = response?.data.find(e => e.name == name) ?? { code: "", name: value, alias: "" };
                            field.onChange(univeristy);
                        }}
                        autoFocus
                        icon={<SchoolIcon />} />
                )}>
                </Controller>
                <Controller name={`graduates.${index}.major`} control={control} render={({ field }) => (
                    <TextFieldSearch
                        {...register(`graduates.${index}.major`)}
                        label="Major"
                        margin='normal'
                        placeholder='Type your major'
                        suggestions={suggestionsMajor}
                        inputText={field.value}
                        handleChange={field.onChange}
                        errors={errors.graduates?.[index]?.major}
                        icon={<SearchIcon />} />
                )}>
                </Controller>

                <TextField margin="normal"
                    fullWidth
                    label="School Year"
                    placeholder='Ex: 2020-2024' {...register(`graduates.${index}.schoolYear`)}
                    error={!!errors?.graduates?.[index]?.schoolYear}
                    helperText={getHelperTextMessage(errors?.graduates?.[index]?.schoolYear)} />
                <TextField
                    {...register(`graduates.${index}.gpa`)}
                    margin="normal"
                    fullWidth
                    label="GPA"
                    placeholder='Type your GPA'
                    disabled={loading}
                    error={!!errors?.graduates?.[index]?.gpa}
                    helperText={errors?.graduates?.[index]?.gpa?.message}
                    sx={{
                        "& .MuiInputBase-input": {
                            padding: "16px"
                        }
                    }}
                />
                <FormControlLabel
                    control={<Checkbox {...register(`graduates.${index}.isCompleted`)} />}
                    name='isComplete'
                    label={<Typography color='textSecondary'>Are you completed ?</Typography>}
                />
            </CardContent>


        </StyledCard>

    )
}



export default Graduate