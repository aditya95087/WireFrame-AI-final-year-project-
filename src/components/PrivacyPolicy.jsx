import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-xl border border-green-500/20 mb-6">
                        <Shield className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
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
                            <Eye className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
                        </div>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                We collect information you provide directly to us, such as when you create an account, update your profile, or use our services. This may include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name, email address, and password</li>
                                <li>Project descriptions and generated wireframe data</li>
                                <li>Payment information (processed securely by our payment providers)</li>
                                <li>Communications you send to us</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
                        </div>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices, updates, and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-6 h-6 text-red-400" />
                            <h2 className="text-2xl font-bold text-white">3. Data Security</h2>
                        </div>
                        <div className="space-y-4 text-gray-400 leading-relaxed">
                            <p>
                                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                            </p>
                            <p>
                                Your project data is encrypted both in transit and at rest. We do not use your private project data to train our public AI models without your explicit consent.
                            </p>
                        </div>
                    </section>

                    <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/5">
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@wireframeai.com" className="text-blue-400 hover:underline">privacy@wireframeai.com</a>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
