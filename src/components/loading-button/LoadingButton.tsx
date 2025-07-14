import { Button, ButtonProps, CircularProgress } from '@mui/material';
import clsx from 'clsx';
import { FC } from 'react';
import './loading-button.scss';

interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
}

/**
 * Generic Loading button. Acts alike `@mui/lab/LoadingButton` but having less props.
 * For now by default disabled have specific design(with primary blue).
 */
export const LoadingButton: FC<LoadingButtonProps> = ({ children, loading, className, ...rest }) => {
    return (
        <Button disabled={rest.disabled || loading} className={clsx('generic-loading-button', className)} {...rest}>
            {loading && <CircularProgress />}
            {children}
        </Button>
    );
};
