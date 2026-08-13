import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Loader2, Download, Image as ImageIcon, FileText, CheckCircle2, ZoomIn, ZoomOut, Maximize, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSingleDiagram } from '../services/gemini';

const DiagramMaker = () => {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [diagramCode, setDiagramCode] = useState("");
    const [error, setError] = useState("");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [recentSearches, setRecentSearches] = useState([]);
    
    // Zoom and Pan state
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
            // Prevent auto-scaling that crushes labels
            flowchart: { htmlLabels: true, useMaxWidth: false },
            sequence: { useMaxWidth: false },
            journey: { useMaxWidth: false },
            gantt: { useMaxWidth: false },
            class: { useMaxWidth: false },
            state: { useMaxWidth: false },
            er: { useMaxWidth: false },
        });

        // Fetch recent searches
        const fetchRecentSearches = async () => {
            try {
                const userDataStr = localStorage.getItem('user-data');
                const userData = userDataStr ? JSON.parse(userDataStr) : null;
                if (userData?._id) {
                    const res = await fetch(`http://localhost:8080/api/activity/${userData._id}?type=diagram_maker`);
                    if (res.ok) {
                        const data = await res.json();
                        setRecentSearches(data.map(d => d.prompt));
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to fetch recent searches", e);
            }
            try {
                const local = JSON.parse(localStorage.getItem('recent_searches_diagram') || '[]');
                setRecentSearches(local);
            } catch (e) {
                setRecentSearches([]);
            }
        };
        fetchRecentSearches();
    }, []);

    useEffect(() => {
        if (diagramCode && containerRef.current) {
            // Reset zoom and pan on new diagram
            setScale(1);
            setPosition({ x: 0, y: 0 });

            const renderDiagram = async () => {
                try {
                    setError("");
                    containerRef.current.innerHTML = '';
                    const id = `diagram-${Math.random().toString(36).substring(2, 9)}`;
                    const { svg } = await mermaid.render(id, diagramCode);
                    containerRef.current.innerHTML = svg;
                } catch (err) {
                    console.error("Mermaid Render Error", err);
                    setError("Failed to render diagram syntax. The AI might have produced invalid Mermaid code.");
                }
            };
            renderDiagram();
        }
    }, [diagramCode]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError("");
        setDiagramCode("");
        
        // Save activity to MongoDB backend and LocalStorage
        try {
            const userDataStr = localStorage.getItem('user-data');
            const userData = userDataStr ? JSON.parse(userDataStr) : null;

            fetch("http://localhost:8080/api/activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userData?._id,
                    activityType: 'diagram_maker',
                    prompt
                })
            }).catch(e => console.error("Failed to save activity", e));
            
            const localKey = 'recent_searches_diagram';
            const local = JSON.parse(localStorage.getItem(localKey) || '[]');
            const newLocal = [prompt, ...local.filter(p => p !== prompt)].slice(0, 10);
            localStorage.setItem(localKey, JSON.stringify(newLocal));
            setRecentSearches(newLocal);
        } catch (e) {
            console.error("Error saving activity:", e);
        }

        try {
            const code = await generateSingleDiagram(prompt);
            setDiagramCode(code);
        } catch (err) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadSVG = () => {
        if (!containerRef.current) return;
        const svgElement = containerRef.current.querySelector('svg');
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `diagram-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadPNG = () => {
        if (!containerRef.current) return;
        const svgElement = containerRef.current.querySelector('svg');
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);
        
        // Ensure proper dimensions before converting to Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const svgRect = svgElement.getBoundingClientRect();
        
        // High DPI for crisp PNG
        canvas.width = svgRect.width * 2 || 800;
        canvas.height = svgRect.height * 2 || 600;

        // Force background fill
        ctx.fillStyle = '#0F0F12'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        img.onload = () => {
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `diagram-${Date.now()}.png`;
            link.click();
        };

        const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
        img.src = `data:image/svg+xml;base64,${svgBase64}`;
    };

    const handlePrintPDF = () => {
        window.print();
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.2));
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setScale(prev => Math.min(Math.max(prev + delta, 0.2), 4));
        }
    };

    // Supported diagram types for the showcase grid
    const capabilities = [
        "Flowcharts", "Sequence Diagrams", "Class Diagrams", 
        "State Diagrams", "Entity-Relationship", "User Journeys", 
        "Gantt Charts", "Pie Charts", "Mindmaps", "Timelines"
    ];

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div 
            className="min-h-screen bg-[#050505] text-white p-6 font-['Outfit'] relative overflow-x-hidden tracking-wide"
            onMouseMove={handleMouseMove}
        >
            {/* Interactive Mouse Glow Background */}
            <div 
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.1), transparent 40%)`
                }}
            />

            {/* Top Navigation */}
            <button
                onClick={() => navigate('/')}
                className="fixed top-6 left-6 z-50 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                title="Back to Home"
            >
                <ArrowLeft size={20} className="text-gray-400" />
            </button>

            <div className="relative z-10 max-w-5xl mx-auto pt-16 space-y-12">
                
                {/* Hero / Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-highlight drop-shadow-lg">
                          𝐖𝐢𝐫𝐞𝐅𝐫𝐚𝐦𝐞𝐀𝐈 𝐃𝐢𝐚𝐠𝐫𝐚𝐦 𝐒𝐭𝐮𝐝𝐢𝐨
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Instantly turn your thoughts into professional programming diagrams. The AI intelligently selects the perfect visual format to map your concept.
                    </p>
                </div>

                {/* Capabilities Quote Board */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl shadow-highlight/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-highlight/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-highlight/30 transition-colors" />
                    
                    <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider text-center flex items-center justify-center gap-3">
                        <span className="w-12 h-[1px] bg-white/20"></span>
                        Capable of Generating All Programming Diagrams
                        <span className="w-12 h-[1px] bg-white/20"></span>
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-4 text-sm text-gray-300">
                        {capabilities.map((type, i) => (
                            <div key={i} className="flex items-center gap-3 hover:text-white transition-colors cursor-default">
                                <div className="p-1.5 rounded-full bg-highlight/10 text-highlight">
                                    <CheckCircle2 size={16} />
                                </div>
                                <span className="font-medium whitespace-nowrap">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-[#0F0F12] border border-white/10 p-6 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="E.g., A sequence diagram showing a user logging in securely and viewing their dashboard overview..."
                            className="flex-1 min-h-[140px] md:min-h-0 bg-black/50 border border-white/10 rounded-xl p-5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight resize-y text-lg leading-relaxed shadow-inner custom-scrollbar"
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="px-8 py-4 bg-gradient-to-br from-highlight to-blue-600 hover:from-highlight/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all min-w-[180px] shadow-lg shadow-highlight/20 hover:shadow-highlight/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Play size={24} className="fill-white" />}
                            {isGenerating ? 'Generating...' : 'Generate Diagram'}
                        </button>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Recent Diagrams</h3>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((search, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPrompt(search)}
                                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-highlight/30 hover:bg-highlight/10 transition-all max-w-[200px] truncate"
                                        title={search}
                                    >
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Boundary Output */}
                {error && (
                    <div className="p-6 bg-red-950/30 border border-red-500/20 text-red-200 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2 font-semibold text-red-400 mb-2">
                            <span>Analysis Error</span>
                        </div>
                        <p>{error}</p>
                        {diagramCode && (
                            <div className="mt-4 text-xs font-mono whitespace-pre-wrap bg-red-950/50 p-4 rounded-xl border border-red-500/10 text-red-300/70 overflow-x-auto">
                                {diagramCode}
                            </div>
                        )}
                    </div>
                )}

                {/* Generated Output Canvas */}
                {(isGenerating || diagramCode) && (
                    <div className="bg-[#0F0F12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/5 transition-all outline outline-1 outline-white/5 relative">
                        
                        {/* Action Toolbar */}
                        {diagramCode && !isGenerating && (
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-200">Generated Output</h3>
                                </div>
                                
                                <div className="flex flex-wrap md:flex-nowrap gap-2">
                                    <button onClick={handleDownloadSVG} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg transition-colors">
                                        <Download size={16} /> SVG
                                    </button>
                                    <button onClick={handleDownloadPNG} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 rounded-lg transition-colors">
                                        <ImageIcon size={16} /> PNG
                                    </button>
                                    <button onClick={handlePrintPDF} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-highlight/10 text-highlight border border-highlight/20 hover:bg-highlight/20 rounded-lg transition-colors group">
                                        <FileText size={16} className="group-hover:scale-110 transition-transform" /> PDF
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-8 min-h-[600px] flex flex-col relative print:bg-white print:text-black overflow-hidden bg-black/20">
                            {/* Floating Toolbar Controls */}
                            {diagramCode && !isGenerating && (
                                <div className="absolute top-6 right-6 flex flex-col gap-2 z-30">
                                    <button 
                                        onClick={handleZoomIn}
                                        className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 hover:text-highlight transition-all shadow-xl"
                                        title="Zoom In"
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                    <button 
                                        onClick={handleZoomOut}
                                        className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 hover:text-highlight transition-all shadow-xl"
                                        title="Zoom Out"
                                    >
                                        <ZoomOut size={20} />
                                    </button>
                                    <button 
                                        onClick={handleReset}
                                        className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 text-gray-300 hover:text-highlight transition-all shadow-xl"
                                        title="Reset View"
                                    >
                                        <Maximize size={20} />
                                    </button>
                                </div>
                            )}

                            {isGenerating ? (
                               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-black/40 backdrop-blur-sm z-10">
                                   <div className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl flex flex-col items-center">
                                       <Loader2 size={48} className="animate-spin mb-6 text-highlight" />
                                       <p className="text-lg font-medium text-white">Crafting your diagram...</p>
                                       <p className="text-sm mt-2 text-gray-500">Choosing the perfect visualization format</p>
                                   </div>
                               </div>
                            ) : (
                                <div 
                                    className="flex-1 flex items-center justify-center p-4 cursor-grab active:cursor-grabbing overflow-hidden"
                                    onWheel={handleWheel}
                                >
                                    <motion.div 
                                        drag
                                        dragMomentum={false}
                                        animate={{ 
                                            scale: scale,
                                            x: position.x,
                                            y: position.y
                                        }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                        onDragEnd={(e, info) => {
                                            setPosition({ 
                                                x: position.x + info.offset.x, 
                                                y: position.y + info.offset.y 
                                            });
                                        }}
                                        className="w-full flex justify-center diagram-container print:w-full print:h-auto print:p-0"
                                    >
                                        <div ref={containerRef} className="w-full flex justify-center" />
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Global style for printing nicely and fixing SVG text cutoff */}
            <style dangerouslySetInnerHTML={{__html: `
                /* Fix Mermaid SVG text cutoffs and ensure initial fit */
                .diagram-container svg { 
                    overflow: visible !important; 
                    max-width: 100% !important;
                    max-height: 600px !important;
                    height: auto !important;
                    width: auto !important;
                }
                .diagram-container .nodeLabel, 
                .diagram-container .edgeLabel {
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                    line-height: 1.3;
                }
                /* Increase text visibility and prevent clipping */
                .diagram-container text {
                    font-size: 14px !important;
                    dominant-baseline: central;
                }
                
                @media print {
                    body { visibility: hidden; background: white !important; }
                    .diagram-container, .diagram-container * { visibility: visible; }
                    .diagram-container { position: absolute; left: 0; top: 0; width: 100% !important; height: auto !important; }
                    .diagram-container svg { max-width: 100% !important; height: auto !important; }
                }
            `}} />
        </div>
    );
}

export default DiagramMaker;
