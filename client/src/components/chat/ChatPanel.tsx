import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { generateAISchema } from "../../services/api";
import type { ChatMessage as ChatMessageType, Table } from "../../types/generator";

interface Props {
    onApplySchema: (tables: Table[]) => void;
}

const SUGGESTIONS = [
    "Create a simple database for a library system with books and members",
    "I need a schema to track gym workouts and users",
    "Add a table named 'logs' with id, message, and level"
];

function ChatPanel({ onApplySchema }: Props) {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (userInput: string) => {
        const userMsg: ChatMessageType = {
            id: crypto.randomUUID(),
            role: "user",
            content: userInput,
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const data = await generateAISchema(userInput);

            const tables: Table[] = data.tables.map((t: any) => ({
                id: crypto.randomUUID(),
                table_name: t.table_name,
                rows: t.rows,
                columns: t.columns.map((c: any) => ({
                    id: crypto.randomUUID(),
                    name: c.name,
                    type: c.type,
                    min: c.min,
                    max: c.max,
                    unique: c.unique || false,
                    ref: c.ref || undefined,
                })),
            }));

            const aiMsg: ChatMessageType = {
                id: crypto.randomUUID(),
                role: "ai",
                content: `Here is the schema based on your request:\n- Generated ${tables.length} table(s)\n- Click 'Apply to Canvas' to visualize and edit.`,
                schema: tables,
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg: ChatMessageType = {
                id: crypto.randomUUID(),
                role: "ai",
                content: "I encountered an error generating the schema. Please try again or refine your prompt.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface-solid/50 border-r border-border backdrop-blur-xl">
            {/* Header */}
            <div className="px-6 h-17 border-b border-border flex items-center gap-3 bg-base/30">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-white tracking-wide">GeneratorX</h2>
                    <p className="text-[11px] text-slate-400">Generate Schema for you data</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 animate-pulse">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1">Generate database schemas</h3>
                        <p className="text-xs text-slate-500 text-center max-w-[280px] mb-8">
                            Describe your requirements and the AI assistant will build the schema.
                        </p>

                        <div className="w-full flex flex-col gap-3 max-w-[340px]">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setInputValue(s)}
                                    className="w-full text-left p-3.5 rounded-xl border border-border bg-surface-solid hover:border-primary/40 hover:bg-slate-800/30 hover:shadow-[0_0_15px_rgba(56,189,248,0.05)] transition-all duration-200 group flex items-start gap-2.5"
                                >
                                    <span className="text-xs text-slate-300 font-medium leading-relaxed group-hover:text-primary transition-colors flex-1">
                                        "{s}"
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        onApplySchema={msg.role === "ai" ? onApplySchema : undefined}
                    />
                ))}

                {loading && (
                    <div className="flex items-center gap-3 text-slate-400 text-sm animate-pulse ml-2 mb-6">
                        <Sparkles className="w-4 h-4" /> Thinking...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} loading={loading} input={input} setInput={setInputValue} />
        </div>
    );
}

export default ChatPanel;
