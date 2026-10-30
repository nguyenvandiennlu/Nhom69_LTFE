import type {Message} from '../types/message';

interface Props {
    message: Message;
    isOwn: boolean;
    isGrouped: boolean;
}

export default function MessageItem({message, isOwn, isGrouped}: Props) {
    const colorIndex = message.user.charCodeAt(0) % 5;
    return (
        <div className={isGrouped ? "message d-flex gap-3 px-3 py-0" : "message d-flex gap-3 px-3 py-2"}>
            {isGrouped ?
                (<div className="message__spacer"></div>)
                :
                (<div className={`message__avatar message__avatar--${colorIndex}`}>
                    {message.user.charAt(0).toUpperCase()}
                </div>)
            }

            <div className="message__body">
                {!isGrouped && (
                    <div>
                        <span className={isOwn ? 'message__name message__name--own' : 'message__name'}>
                            {message.user}
                        </span>
                        <span className="message__time ms-2">
                            {new Date(message.time).toLocaleString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                        </span>
                    </div>
                    )
                }
                <div className="message__text">{message.text}</div>
            </div>

        </div>
    );
}