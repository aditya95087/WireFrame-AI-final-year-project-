import React, { useState, useRef, useEffect } from 'react';
import { generateHtmlCssDesign, generateGeneralCode, generateHtmlCssDesignStreaming, generateGeneralCodeStreaming } from '../services/gemini';
import { Loader2, Code2, Copy, Check, Play, ArrowLeft, Layout, Cpu, RefreshCw, Send, Terminal, Maximize, Minimize, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Markdown + Code Block Parser ────────────────────────── */

// VS Code Dark+ inspired syntax highlighter
const highlightCode = (code, language) => {
    const lang = (language || '').toLowerCase();

    // Define token patterns per-category (order matters — first match wins per character)
    const patterns = [];

    // 1. Comments (single line and multi-line)
    patterns.push({ regex: /\/\/.*$/gm, className: 'text-[#6A9955]' }); // green
    patterns.push({ regex: /#.*$/gm, className: 'text-[#6A9955]' });   // python/bash comments
    patterns.push({ regex: /\/\*[\s\S]*?\*\//gm, className: 'text-[#6A9955]' });
    if (['html', 'xml'].includes(lang)) {
        patterns.push({ regex: /<!--[\s\S]*?-->/gm, className: 'text-[#6A9955]' });
    }

    // 2. Strings
    patterns.push({ regex: /"(?:[^"\\]|\\.)*"/g, className: 'text-[#CE9178]' });  // orange-brown
    patterns.push({ regex: /'(?:[^'\\]|\\.)*'/g, className: 'text-[#CE9178]' });
    patterns.push({ regex: /`(?:[^`\\]|\\.)*`/g, className: 'text-[#CE9178]' });

    // 3. Numbers
    patterns.push({ regex: /\b\d+\.?\d*\b/g, className: 'text-[#B5CEA8]' }); // light green

    // 4. Preprocessor / includes
    patterns.push({ regex: /^\s*#\s*(include|define|ifdef|ifndef|endif|pragma|import)\b.*$/gm, className: 'text-[#C586C0]' });

    // 5. Keywords (language-aware)
    const cKeywords = /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|NULL|true|false)\b/g;
    const jsKeywords = /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|of|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|true|false|null|undefined|console|document|window)\b/g;
    const pyKeywords = /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None|print|self|range|len|input|int|str|float|list|dict|set|tuple)\b/g;
    const javaKeywords = /\b(abstract|assert|boolean|break|byte|case|catch|char|class|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|String|System|out|println)\b/g;
    const cppKeywords = /\b(auto|break|case|char|class|const|constexpr|continue|default|delete|do|double|dynamic_cast|else|enum|explicit|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|return|short|signed|sizeof|static|static_cast|struct|switch|template|this|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while|bool|true|false|cout|cin|endl|std|string|vector|map|set|include|iostream)\b/g;
    const htmlTags = /(&lt;\/?)([\w-]+)/g;

    let keywordPattern;
    if (['c'].includes(lang)) keywordPattern = cKeywords;
    else if (['cpp', 'c++', 'cc', 'cxx'].includes(lang)) keywordPattern = cppKeywords;
    else if (['python', 'py'].includes(lang)) keywordPattern = pyKeywords;
    else if (['java', 'kotlin'].includes(lang)) keywordPattern = javaKeywords;
    else if (['javascript', 'js', 'jsx', 'ts', 'tsx', 'typescript'].includes(lang)) keywordPattern = jsKeywords;
    else keywordPattern = jsKeywords; // default fallback

    patterns.push({ regex: keywordPattern, className: 'text-[#569CD6]' }); // blue

    // 6. Types (capitalize)
    patterns.push({ regex: /\b[A-Z][a-zA-Z0-9_]*\b/g, className: 'text-[#4EC9B0]' }); // teal

    // 7. Function calls
    patterns.push({ regex: /\b([a-zA-Z_]\w*)\s*(?=\()/g, className: 'text-[#DCDCAA]' }); // yellow

    // Build highlighted output
    // We'll use a simpler approach: apply all patterns sequentially, wrapping matches in spans.
    // To avoid double-highlighting, we mark already-highlighted regions.
    
    const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escaped = escapeHtml(code);

    // Create an array tracking which chars are already colored
    const charColors = new Array(escaped.length).fill(null);

    for (const { regex, className } of patterns) {
        regex.lastIndex = 0;
        let m;
        while ((m = regex.exec(escaped)) !== null) {
            const start = m.index;
            const end = start + m[0].length;
            // Only color if no character in this range is already colored
            let free = true;
            for (let i = start; i < end; i++) {
                if (charColors[i] !== null) { free = false; break; }
            }
            if (free) {
                for (let i = start; i < end; i++) {
                    charColors[i] = className;
                }
            }
        }
    }

    // Build HTML string
    let html = '';
    let i = 0;
    while (i < escaped.length) {
        if (charColors[i]) {
            const cls = charColors[i];
            let j = i;
            while (j < escaped.length && charColors[j] === cls) j++;
            html += `<span class="${cls}">${escaped.substring(i, j)}</span>`;
            i = j;
        } else {
            html += escaped[i];
            i++;
        }
    }

    return html;
};

const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const highlightedHtml = highlightCode(code, language);

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 my-4 shadow-lg bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-gray-500" />
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">{language || 'Code'}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
                >
                    {copied ? <><Check size={13} className="text-green-400" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
            </div>
            <pre className="p-5 overflow-x-auto custom-scrollbar text-[13px] leading-relaxed bg-[#1e1e1e]">
                <code
                    className="font-mono text-[#D4D4D4] whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
            </pre>
        </div>
    );
};

const MarkdownRenderer = ({ text }) => {
    // Split the text into segments of code blocks and regular text
    const segments = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        // Push text before this code block
        if (match.index > lastIndex) {
            segments.push({ type: 'text', content: text.substring(lastIndex, match.index) });
        }
        segments.push({ type: 'code', language: match[1], content: match[2].trim() });
        lastIndex = match.index + match[0].length;
    }
    // Push remaining text
    if (lastIndex < text.length) {
        segments.push({ type: 'text', content: text.substring(lastIndex) });
    }

    const renderTextBlock = (content, key) => {
        const lines = content.split('\n');
        return (
            <div key={key} className="space-y-2">
                {lines.map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={i} className="h-3" />;

                    // Heading ##
                    if (trimmed.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{renderInlineMarkdown(trimmed.slice(3))}</h2>;
                    }
                    if (trimmed.startsWith('### ')) {
                        return <h3 key={i} className="text-lg font-bold text-white mt-5 mb-2">{renderInlineMarkdown(trimmed.slice(4))}</h3>;
                    }
                    if (trimmed.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{renderInlineMarkdown(trimmed.slice(2))}</h1>;
                    }
                    // Horizontal rule
                    if (trimmed === '---' || trimmed === '***') {
                        return <hr key={i} className="border-white/10 my-4" />;
                    }
                    // Regular paragraph
                    return <p key={i} className="text-gray-300 leading-relaxed text-[15px]">{renderInlineMarkdown(trimmed)}</p>;
                })}
            </div>
        );
    };

    const renderInlineMarkdown = (text) => {
        // Bold **text**
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
            }
            // Inline code `text`
            const inlineParts = part.split(/(`.*?`)/g);
            return inlineParts.map((ip, j) => {
                if (ip.startsWith('`') && ip.endsWith('`')) {
                    return <code key={`${i}-${j}`} className="px-1.5 py-0.5 bg-white/10 rounded text-purple-300 text-[13px] font-mono">{ip.slice(1, -1)}</code>;
                }
                return <span key={`${i}-${j}`}>{ip}</span>;
            });
        });
    };

    return (
        <div className="prose prose-invert max-w-none">
            {segments.map((seg, idx) => {
                if (seg.type === 'code') {
                    return <CodeBlock key={idx} language={seg.language} code={seg.content} />;
                }
                return renderTextBlock(seg.content, idx);
            })}
        </div>
    );
};

/* ── Main Component ──────────────────────────────────────── */
const CodeGenerator = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]); // { role: 'user' | 'ai', content: string }
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('logic'); // 'web' or 'logic'

    // Web design specific state
    const [webCode, setWebCode] = useState('');
    const [activeView, setActiveView] = useState('preview');
    const [isCopied, setIsCopied] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isFullscreen]);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        const fetchRecentSearches = async () => {
            const currentMode = mode === 'web' ? 'web_design' : 'code_generator';
            try {
                const userDataStr = localStorage.getItem('user-data');
                const userData = userDataStr ? JSON.parse(userDataStr) : null;
                if (userData?._id) {
                    const res = await fetch(`http://localhost:8080/api/activity/${userData._id}?type=${currentMode}`);
                    if (res.ok) {
                        const data = await res.json();
                        setRecentSearches(data.map(d => d.prompt));
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to fetch recent searches", e);
            }
            // Fallback to local storage
            try {
                const local = JSON.parse(localStorage.getItem(`recent_searches_${currentMode}`) || '[]');
                setRecentSearches(local);
            } catch (e) {
                setRecentSearches([]);
            }
        };
        fetchRecentSearches();
    }, [mode]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        const userPrompt = prompt;
        setPrompt('');
        setError(null);

        // Save activity to MongoDB backend and LocalStorage
        try {
            const userDataStr = localStorage.getItem('user-data');
            const userData = userDataStr ? JSON.parse(userDataStr) : null;
            const activityType = mode === 'web' ? 'web_design' : 'code_generator';

            fetch("http://localhost:8080/api/activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userData?._id,
                    activityType: activityType,
                    prompt: userPrompt
                })
            }).catch(e => console.error("Failed to save activity", e));
            
            // Save to LocalStorage
            const localKey = `recent_searches_${activityType}`;
            const local = JSON.parse(localStorage.getItem(localKey) || '[]');
            const newLocal = [userPrompt, ...local.filter(p => p !== userPrompt)].slice(0, 10);
            localStorage.setItem(localKey, JSON.stringify(newLocal));
            setRecentSearches(newLocal);
        } catch (e) {
            console.error("Error saving activity:", e);
        }

        if (mode === 'web') {
            setIsLoading(true);
            setWebCode('');
            setActiveView('code'); // Show code view while generating
            try {
                await generateHtmlCssDesignStreaming(userPrompt, (chunk) => {
                    setWebCode(chunk);
                });
                // Once finished, we can optionally switch to preview or let the user decide
                // For better UX, we'll stay in code view so they can see the final result, 
                // but they can switch to preview manually or we can auto-switch after a delay.
                setTimeout(() => setActiveView('preview'), 1000);
            } catch (err) {
                setError(err.message || 'Failed to generate code.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Chat-like logic mode
            const userMsg = { role: 'user', content: userPrompt };
            setMessages(prev => [...prev, userMsg]);
            setIsLoading(true);
            
            // Initialize empty AI message
            setMessages(prev => [...prev, { role: 'ai', content: '' }]);
            
            try {
                await generateGeneralCodeStreaming(userPrompt, (fullText) => {
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1] = { role: 'ai', content: fullText };
                        return newMsgs;
                    });
                });
            } catch (err) {
                setError(err.message || 'Failed to generate code.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleWebCopy = () => {
        if (!webCode) return;
        navigator.clipboard.writeText(webCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-black/95 text-gray-300 font-sans selection:bg-highlight/30 flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                        title="Back to Home"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                        <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg text-blue-400">
                            <Code2 size={20} />
                        </div>
                        <h1 className="text-lg font-bold text-white tracking-tight">WireFrame Code Generator</h1>
                    </div>
                </div>

                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => { setMode('logic'); setWebCode(''); }}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                            mode === 'logic' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <Cpu size={14} /> Code Logic
                    </button>
                    <button
                        onClick={() => { setMode('web'); setMessages([]); }}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                            mode === 'web' ? 'bg-highlight text-white shadow-lg shadow-highlight/20' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <Layout size={14} /> Web Design
                    </button>
                </div>
            </header>

            {/* ─── CODE LOGIC MODE ────────────────────────────────── */}
            {mode === 'logic' && (
                <main className="flex-1 flex flex-col pt-16">
                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 md:px-0 pb-36 custom-scrollbar">
                        <div className="max-w-4xl mx-auto py-8 space-y-6">
                            {messages.length === 0 && !isLoading && (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                                    <div className="p-5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl mb-6 border border-white/5">
                                        <Code2 size={40} className="text-purple-400/50" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-3">Ask Any Coding Question</h2>
                                    <p className="max-w-md text-gray-500 text-sm leading-relaxed mb-8">
                                        DSA in C? React hooks? Python algorithms? Ask anything and get clean, structured code with explanations.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {['DSA questions in C', 'React custom hooks', 'Python sorting algorithms', 'Java OOP concepts'].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => setPrompt(suggestion)}
                                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {recentSearches.length > 0 && (
                                        <div className="mt-10 border-t border-white/5 pt-8">
                                            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest">Your Recent Searches</h3>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {recentSearches.map((search, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setPrompt(search)}
                                                        className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all max-w-[300px] truncate"
                                                    >
                                                        {search}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {msg.role === 'user' ? (
                                        <div className="flex justify-end">
                                            <div className="bg-purple-600/20 border border-purple-500/20 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-lg text-[15px] font-medium shadow-md">
                                                {msg.content}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
                                            <MarkdownRenderer text={msg.content} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">Generating code...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Fixed Bottom Input */}
                    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-6 px-4 z-40">
                        <div className="max-w-4xl mx-auto">
                            {error && (
                                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="flex items-end gap-3 bg-[#111116] border border-white/10 rounded-2xl p-3 shadow-2xl focus-within:border-purple-500/30 transition-colors">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ask a coding question..."
                                    rows={1}
                                    className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:outline-none resize-none text-[15px] leading-relaxed px-2 py-1 max-h-32 custom-scrollbar"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleGenerate();
                                        }
                                    }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                    }}
                                />
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !prompt.trim()}
                                    className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shrink-0 shadow-lg shadow-purple-600/20"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* ─── WEB DESIGN MODE ───────────────────────────────── */}
            {mode === 'web' && (
                <main className="flex-1 flex flex-col pt-16 h-screen overflow-hidden">
                    {/* Input Bar (compact, always visible) */}
                    <div className="shrink-0 bg-[#111116] border-b border-white/5 px-6 py-4">
                        <div className="max-w-7xl mx-auto flex items-end gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1 block">Describe your layout</label>
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="E.g., A modern dark-themed landing page for a coffee shop with hero, menu grid & contact form..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-highlight/50 transition-all text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleGenerate();
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt.trim()}
                                className="px-6 py-3 bg-highlight text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-highlight/20 flex items-center gap-2 text-sm shrink-0 mb-0.5"
                            >
                                {isLoading ? (
                                    <><RefreshCw size={16} className="animate-spin" /> Generating...</>
                                ) : (
                                    <><Play size={16} /> Generate Design</>
                                )}
                            </button>
                        </div>
                        {error && (
                            <div className="max-w-7xl mx-auto mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
                        )}
                    </div>

                    {/* Result Section — takes all remaining height */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <AnimatePresence mode="wait">
                            {(webCode || isLoading) ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col overflow-hidden"
                                >
                                    {/* Toolbar */}
                                    <div className="shrink-0 flex items-center justify-between px-6 py-2.5 bg-[#1a1a1f] border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
                                                <button
                                                    onClick={() => setActiveView('preview')}
                                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                                                        activeView === 'preview' ? 'bg-highlight/20 text-highlight shadow-sm' : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    <Play size={13} /> Preview
                                                </button>
                                                <button
                                                    onClick={() => setActiveView('code')}
                                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                                                        activeView === 'code' ? 'bg-highlight/20 text-highlight shadow-sm' : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    <Code2 size={13} /> Code
                                                </button>
                                            </div>
                                            {activeView === 'preview' && !isLoading && (
                                                <span className="text-[10px] text-green-500 uppercase tracking-wider font-bold animate-pulse">
                                                    ● Live
                                                </span>
                                            )}
                                            {isLoading && (
                                                <span className="text-[10px] text-highlight uppercase tracking-wider font-bold flex items-center gap-2">
                                                    <RefreshCw size={10} className="animate-spin" /> Generating Code...
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activeView === 'preview' && (
                                                <button
                                                    onClick={() => setIsFullscreen(true)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-highlight/10 hover:bg-highlight/20 text-highlight rounded-lg text-xs transition-all border border-highlight/20 font-medium"
                                                    title="Full Screen Preview"
                                                >
                                                    <Maximize size={14} /> Full Preview
                                                </button>
                                            )}
                                            <button
                                                onClick={handleWebCopy}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-all border border-white/5 font-medium"
                                            >
                                                {isCopied ? <><Check size={14} className="text-green-400" /> Copied!</> : <><Copy size={14} /> Copy</>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content — fills all remaining space */}
                                    <div className="flex-1 relative overflow-hidden">
                                        {activeView === 'preview' ? (
                                            <iframe
                                                title="Code Preview"
                                                srcDoc={webCode}
                                                className="absolute inset-0 w-full h-full border-none bg-white"
                                                sandbox="allow-scripts allow-modals"
                                                style={{ minHeight: '100%' }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 overflow-auto p-6 custom-scrollbar bg-[#1e1e1e]">
                                                <pre className="text-[13px] leading-relaxed">
                                                    <code
                                                        className="font-mono text-[#D4D4D4] whitespace-pre"
                                                        dangerouslySetInnerHTML={{ __html: highlightCode(webCode, 'html') }}
                                                    />
                                                    {isLoading && <span className="inline-block w-2 h-4 bg-highlight/50 ml-1 animate-pulse align-middle" />}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : !isLoading && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-600"
                                >
                                    <div className="p-5 bg-white/5 rounded-3xl mb-6">
                                        <Layout size={40} className="opacity-20" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-400 mb-2">Describe a Website Layout</h2>
                                    <p className="max-w-md text-sm leading-relaxed mb-8">
                                        We'll generate clean, professional HTML & CSS with a full-screen live preview.
                                    </p>
                                    
                                    {recentSearches.length > 0 && (
                                        <div className="mt-4 border-t border-white/5 pt-8 w-full max-w-2xl">
                                            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest">Your Recent Searches</h3>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {recentSearches.map((search, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setPrompt(search)}
                                                        className="px-4 py-2 bg-highlight/10 border border-highlight/20 rounded-full text-sm text-highlight hover:text-white hover:bg-highlight/30 transition-all max-w-[350px] truncate"
                                                    >
                                                        {search}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            )}

            {/* Fullscreen Preview Overlay */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col"
                    >
                        <div className="flex items-center justify-between p-3 bg-[#111116] text-white border-b border-white/10 shrink-0">
                            <div className="flex items-center gap-3 px-2">
                                <div className="p-1.5 bg-highlight/20 rounded text-highlight">
                                    <Layout size={18} />
                                </div>
                                <span className="font-bold text-sm tracking-wide">Live Preview</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 font-medium hidden sm:block mr-2">Press ESC to close</span>
                                <button
                                    onClick={() => setIsFullscreen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                    title="Close Preview"
                                >
                                    <X size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                                </button>
                            </div>
                        </div>
                        <iframe
                            title="Full Screen Preview"
                            srcDoc={webCode}
                            className="flex-1 w-full h-full border-none bg-white"
                            sandbox="allow-scripts allow-modals"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CodeGenerator;
