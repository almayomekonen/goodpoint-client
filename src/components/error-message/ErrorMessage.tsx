import style from './style.module.scss';

interface ErrorMessageProps {
    errorMessage: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }: ErrorMessageProps) => {
    return <div className={style.message}>{errorMessage}</div>;
};
export default ErrorMessage;
