interface IProps {
    message: string
}

export const ErrorBanner = ({ message }: IProps) => {
    return (
        <div className="error-banner">
            <p>{message}</p>
        </div>
    )
}

export default ErrorBanner
