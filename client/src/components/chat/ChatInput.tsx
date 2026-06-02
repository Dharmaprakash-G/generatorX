import { useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "../../utils/cn";

interface Props {
    onSend: (message: string) => void;
    loading: boolean;
    input: string;
    setInput: (val: string) => void;
}

function ChatInput({ onSend, loading, input, setInput }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize when input changes from parent (e.g. clicking suggestions)
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    }, [input]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;
        onSend(trimmed);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    return (
        <div className="p-4 bg-base/50 backdrop-blur-md border-t border-border">
            <div className="relative flex items-end gap-2 bg-surface-solid border border-border rounded-2xl p-2 focus-within:border-primary/50 focus-within:shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all">

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your schema changes..."
                    disabled={loading}
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 resize-none outline-none py-2 px-2 max-h-[120px]"
                />

                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className={cn(
                        "p-2 rounded-xl transition-all flex items-center justify-center",
                        loading || !input.trim()
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-primary text-slate-900 hover:bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                    )}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default ChatInput;
