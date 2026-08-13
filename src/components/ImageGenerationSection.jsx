import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Search, Loader2, Download, Maximize2, X, Box, Layers } from 'lucide-react';
import { generateVectorSvg, fetchPexelsHighRes } from '../services/gemini';

const ImageGenerationSection = () => {
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState('image'); // 'image' or 'vector'
    const [result, setResult] = useState(null); // { type: 'url'|'svg', data: string }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const resultRef = useRef(null);

    const handleDownload = async () => {
        if (!result) return;
        setIsDownloading(true);
        try {
            if (result.type === 'svg') {
                const blob = new Blob([result.data], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `wireframe-vector-${prompt.replace(/\s+/g, '-').toLowerCase() || 'design'}.svg`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const response = await fetch(result.data);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `wireframe-ai-${prompt.replace(/\s+/g, '-').toLowerCase() || 'image'}.jpg`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error("Failed to download", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            if (mode === 'vector') {
                const svgData = await generateVectorSvg(prompt);
                if (svgData && svgData.includes('<svg')) {
                    setResult({ type: 'svg', data: svgData });
                } else {
                    setError("Failed to generate a valid vector. Try a more descriptive UI prompt!");
                }
            } else {
                const imageData = await fetchPexelsHighRes(prompt);
                if (imageData) {
                    setResult({ type: 'url', data: imageData.url });
                } else {
                    setError("No high-quality images found for your prompt. Try a different keyword!");
                }
            }
        } catch (err) {
            console.error("Generation error:", err);
            setError(err.message || "Something went wrong during generation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="image-gen" className="py-24 relative overflow-hidden bg-blur">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-highlight/10 border border-highlight/20 text-highlight mb-6 shadow-[0_0_15px_rgba(138,43,226,0.15)] font-medium"
                    >
                        <Layers size={18} />
                        <span>AI Design Studio</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Visualize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight to-blue-500">Ideas Instantly</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Choose between realistic inspiration or scalable vector designs. Perfect for wireframing and high-fidelity mockups.
                    </motion.p>
                </div>

                <div className="max-w-4xl mx-auto relative group">
                    {/* Mode Selector */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-[#0F0F12] border border-white/10 p-1 rounded-xl flex gap-1">
                            <button
                                onClick={() => setMode('image')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${mode === 'image' ? 'bg-highlight text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                <ImageIcon size={18} />
                                <span>High-Res Image</span>
                            </button>
                            <button
                                onClick={() => setMode('vector')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${mode === 'vector' ? 'bg-highlight text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Box size={18} />
                                <span>Scalable Vector</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleGenerate} className="relative z-20 flex flex-col md:flex-row gap-4 mb-12">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={mode === 'vector' ? "e.g. Minimalist analytics dashboard layout" : "e.g. Futuristic smart home interface"}
                                className="block w-full pl-11 pr-4 py-4 bg-[#0F0F12] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition-all shadow-xl"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="bg-highlight hover:bg-highlight/80 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'vector' ? <Box size={20} /> : <ImageIcon size={20} />)}
                            {loading ? (mode === 'vector' ? "Calculating Vectors..." : "Baking Pixels...") : `Generate ${mode === 'vector' ? 'Vector' : 'Image'}`}
                        </button>
                    </form>

                    {/* Result Container */}
                    <div className="relative w-full min-h-[400px] aspect-square md:aspect-video rounded-2xl overflow-hidden bg-[#0a0a0c] border border-white/10 flex items-center justify-center group/img">
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 transition-all duration-300">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-highlight/30 rounded-full blur-xl animate-pulse" />
                                    <Loader2 className="animate-spin text-highlight relative z-10 mb-4" size={48} />
                                </div>
                                <p className="text-gray-300 font-medium tracking-wide animate-pulse">
                                    {mode === 'vector' ? "generating vectors..." : "generating  images..."}
                                </p>
                            </div>
                        )}
                        
                        {!loading && !result && !error && (
                            <div className="text-center p-8">
                                {mode === 'vector' ? <Box size={64} className="mx-auto text-gray-700 mb-4 opacity-50" /> : <ImageIcon size={64} className="mx-auto text-gray-700 mb-4 opacity-50" />}
                                <p className="text-gray-500 font-medium">Your {mode} will appear here</p>
                                <p className="text-gray-600 text-sm mt-2">{mode === 'vector' ? "Generates infinite zoom SVG graphics" : "High-fidelity photographic inspiration"}</p>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <X size={32} className="text-red-400" />
                                </div>
                                <p className="text-red-400 font-medium max-w-sm mx-auto">{error}</p>
                            </div>
                        )}

                        {result && !loading && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-8"
                            >
                                {result.type === 'svg' ? (
                                    <div 
                                        className="w-full h-full flex items-center justify-center overflow-hidden cursor-pointer bg-white/5 rounded-lg p-4"
                                        dangerouslySetInnerHTML={{ __html: result.data }}
                                        onClick={() => setIsModalOpen(true)}
                                    />
                                ) : (
                                    <img
                                        src={result.data}
                                        alt={prompt}
                                        className="w-full h-full object-contain transition-transform duration-700 group-hover/img:scale-105 cursor-pointer"
                                        onClick={() => setIsModalOpen(true)}
                                    />
                                )}

                                <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-300 z-30 flex gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-3 bg-black/60 hover:bg-highlight/90 backdrop-blur-md rounded-full text-white shadow-lg border border-white/20 transition-all flex items-center justify-center pointer-events-auto"
                                        title="View Fullscreen"
                                    >
                                        <Maximize2 size={20} />
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className="p-3 bg-black/60 hover:bg-highlight/90 backdrop-blur-md rounded-full text-white shadow-lg border border-white/20 transition-all disabled:opacity-50 flex items-center justify-center pointer-events-auto"
                                        title={mode === 'vector' ? "Download SVG (Infinite Zoom)" : "Download High-Res Image"}
                                    >
                                        {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {/* Decorative glow */}
                    {result && !loading && (
                        <div className="absolute -inset-4 bg-highlight/20 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
                    )}
                </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-80 h-80 bg-highlight/10 blur-[100px] -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
            
            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && result && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8" onClick={() => setIsModalOpen(false)}>
                        <button 
                            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X size={24} />
                        </button>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {result.type === 'svg' ? (
                                <div 
                                    className="w-full h-full bg-white/5 rounded-2xl p-8 flex items-center justify-center overflow-auto"
                                    dangerouslySetInnerHTML={{ __html: result.data }}
                                />
                            ) : (
                                <img 
                                    src={result.data} 
                                    alt={prompt} 
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ImageGenerationSection;
