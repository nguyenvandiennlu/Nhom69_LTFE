import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { Smile } from 'lucide-react';

interface Props {
    onSelectEmoji: (emoji: string) => void;
}

export default function EmojiPickerButton({ onSelectEmoji }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Tự động đóng popup khi bấm ra bên ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onSelectEmoji(emojiData.emoji);
    };

    return (
        <div className="position-relative d-inline-flex" ref={containerRef}>
            <button
                type="button"
                className={`chat-input__icon d-flex align-items-center ${isOpen ? 'text-warning' : ''}`}
                title="Emoji"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <Smile size={20} />
            </button>

            {isOpen && (
                <div 
                    className="chat-input__emoji-picker position-absolute" 
                    style={{ bottom: '45px', right: 0, zIndex: 1000 }}
                >
                    <EmojiPicker
                        theme={Theme.DARK}
                        lazyLoadEmojis
                        searchPlaceholder="Tìm emoji..."
                        onEmojiClick={handleEmojiClick}
                    />
                </div>
            )}
        </div>
    );
}
