import { DotLoader } from 'react-spinners';

interface Props {
    message?: string;
}

export default function LoadingOverlay({ message = 'Đang xử lý...' }: Props) {
    return (
        <div className="loading-overlay" role="status" aria-live="polite">
            <DotLoader color="#22d3ee" size={50} />
            <span className="loading-overlay__text">{message}</span>
        </div>
    );
}
