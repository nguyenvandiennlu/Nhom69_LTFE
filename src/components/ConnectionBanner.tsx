import { WifiOff, RefreshCw } from 'lucide-react';

interface Props {
    status: 'connecting' | 'open' | 'closed';
}

export default function ConnectionBanner({ status }: Props) {
    if (status === 'open') {
        return null;
    }

    const isConnecting = status === 'connecting';

    return (
        <div 
            className="d-flex align-items-center justify-content-center gap-2 py-1 px-3"
            style={{
                backgroundColor: isConnecting ? '#f0b232' : '#f23f43',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                zIndex: 10,
                transition: 'background-color 0.2s ease'
            }}
        >
            {isConnecting ? (
                <>
                    <RefreshCw size={14} className="spin-animation" />
                    <span>Đang kết nối tới máy chủ WebSocket...</span>
                </>
            ) : (
                <>
                    <WifiOff size={14} />
                    <span>Mất kết nối với máy chủ. Đang thử kết nối lại...</span>
                </>
            )}
        </div>
    );
}
