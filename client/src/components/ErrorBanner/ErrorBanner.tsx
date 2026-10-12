interface IProps {
    message: string,
    clearError: () => void
}

export const ErrorBanner = ({ message, clearError }: IProps) => {
    return (
        <div className="error-banner">
            <p>{message}</p>
            <button onClick={clearError}>Dismiss</button>
        </div>
    )
}

export default ErrorBanner
