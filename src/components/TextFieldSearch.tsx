
import { Autocomplete, InputAdornment, TextField, TextFieldProps } from '@mui/material'
import React, { ReactNode } from 'react'
import { FieldError } from 'react-hook-form';
import { getHelperTextMessage } from '../utils/utils';

interface TextFieldSearchProps<T> extends Omit<TextFieldProps, "onChange" | "value"> {
    suggestions: T[];
    inputText: string;
    handleChange: (value: string) => void;
    icon?: ReactNode
    errors: FieldError | undefined
}


const TextFieldSearch = <T,>({ suggestions, inputText, handleChange, icon, errors, ...TextFieldProps }: TextFieldSearchProps<T>) => {


    return (
        suggestions &&
        <Autocomplete
            freeSolo
            options={suggestions}
            inputValue={inputText}
            onInputChange={(event, newInputValue) => {
                handleChange(newInputValue)
            }}
            componentsProps={{
                paper: {
                    sx: {
                        backgroundColor: "#364b6a",
                        color: "secondary", // Đổi màu chữ nếu cần               
                    },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    {...TextFieldProps}
                    error={!!errors}
                    helperText={getHelperTextMessage(errors)}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            icon && <InputAdornment position="start">
                                {icon}
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        />

    )
}


export default TextFieldSearch