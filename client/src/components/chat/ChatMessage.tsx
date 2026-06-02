import { motion } from "framer-motion";
import { Sparkles, User, ArrowRight } from "lucide-react";
import type { ChatMessage as ChatMessageType, Table } from "../../types/generator";

interface Props {
    message: ChatMessageType;
    onApplySchema?: (tables: Table[]) => void;
}

function ChatMessage({ message, onApplySchema }: Props) {
    const isUser = message.role === "user";

    // Simple markdown-ish parser for bullet points
    const renderContent = (content: string) => {
        return content.split("\n").map((line, i) => {
            if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                return (
                    <li key={i} className="ml-4 list-disc marker:text-primary/50 text-slate-300">
                        {line.substring(1).trim()}
                    </li>
                );
            }
            return <p key={i} className="mb-1 last:mb-0 text-slate-300">{line}</p>;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div className={`flex max-w-[85%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                    {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-400" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                    )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <div
                        className={`px-4 py-3 text-sm leading-relaxed ${
                            isUser
                                ? "bg-primary text-slate-950 rounded-2xl rounded-tr-sm"
                                : "glass-panel rounded-2xl rounded-tl-sm shadow-xl"
                        }`}
                    >
                        {isUser ? (
                            <p className="font-medium">{message.content}</p>
                        ) : (
                            <div className="space-y-1">
                                {renderContent(message.content)}
                            </div>
                        )}
                    </div>

                    {/* Schema Preview / Apply Button */}
                    {!isUser && message.schema && message.schema.length > 0 && (
                        <div className="mt-3 glass-panel-solid w-full rounded-xl p-3 shadow-lg">
                            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">
                                Generated Schema ({message.schema.length} tables)
                            </div>
                            
                            <div className="space-y-1.5 mb-3">
                                {message.schema.map((table: Table) => (
                                    <div key={table.id} className="flex items-center justify-between bg-base border border-border px-2.5 py-1.5 rounded-lg text-xs">
                                        <span className="text-slate-200 font-medium">{table.table_name || "unnamed"}</span>
                                        <span className="text-slate-500 font-mono">{table.columns.length} cols</span>
                                    </div>
                                ))}
                            </div>

                            {onApplySchema && (
                                <button
                                    onClick={() => onApplySchema(message.schema!)}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-primary text-xs font-medium py-2 rounded-lg transition-colors border border-slate-700"
                                >
                                    Apply to Canvas <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default ChatMessage;
