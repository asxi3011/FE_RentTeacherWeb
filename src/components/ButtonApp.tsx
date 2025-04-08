import React, { useState } from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

export const ButtonApp: React.FC<ButtonProps> = ({ children, ...props }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <Button
            disabled={loading}
            onClick={handleClick}
            sx={{ position: 'relative' }}
            {...props}
        >
            {loading
                ? <CircularProgress size={24} color="inherit" />
                : children
            }

        </Button>
    );
}
