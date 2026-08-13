import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-6">
                        <Scale className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-gray-400">Last updated: December 4, 2025</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-12"
                >
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-6 h-6 text-green-400" />
                            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
                        </div>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                By accessing or using WireframeAI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">2. Use License</h2>
                        </div>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                Permission is granted to temporarily download one copy of the materials (information or software) on WireframeAI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>Attempt to decompile or reverse engineer any software contained on WireframeAI's website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <h2 className="text-2xl font-bold text-white">3. Disclaimer</h2>
                        </div>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                The materials on WireframeAI's website are provided on an 'as is' basis. WireframeAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </div>
                    </section>

                    <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/5">
                        <p>
                            If you have any questions about these Terms of Service, please contact us at <a href="mailto:legal@wireframeai.com" className="text-blue-400 hover:underline">legal@wireframeai.com</a>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
