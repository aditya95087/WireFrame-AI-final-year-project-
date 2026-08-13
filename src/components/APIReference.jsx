import React from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Database, Terminal } from 'lucide-react';

const APIReference = () => {
    const endpoints = [
        {
            method: 'POST',
            path: '/v1/generate',
            description: 'Generate a new wireframe project from a text description.',
            params: [
                { name: 'description', type: 'string', required: true, desc: 'The text description of the app idea.' },
                { name: 'platform', type: 'string', required: false, desc: "'web' or 'mobile'. Defaults to 'web'." }
            ],
            example: `curl -X POST https://api.wireframeai.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "A fitness tracking app",
    "platform": "mobile"
  }'`
        },
        {
            method: 'GET',
            path: '/v1/projects',
            description: 'List all projects created by the authenticated user.',
            params: [
                { name: 'limit', type: 'integer', required: false, desc: 'Number of projects to return. Default 10.' },
                { name: 'offset', type: 'integer', required: false, desc: 'Pagination offset.' }
            ],
            example: `curl -X GET https://api.wireframeai.com/v1/projects?limit=5 \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Terminal className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">API Reference</h1>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl">
                        Integrate WireframeAI's generation engine directly into your workflow.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-400" />
                                Authentication
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                All API requests require a Bearer token in the Authorization header.
                            </p>
                            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-300 break-all">
                                Authorization: Bearer YOUR_API_KEY
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Server className="w-5 h-5 text-purple-400" />
                                Base URL
                            </h3>
                            <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-300">
                                https://api.wireframeai.com/v1
                            </div>
                        </div>
                    </div>

                    {/* Endpoints */}
                    <div className="lg:col-span-2 space-y-12">
                        {endpoints.map((endpoint, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                            >
                                <div className="p-6 border-b border-white/5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                                                endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {endpoint.method}
                                        </span>
                                        <code className="text-white font-mono">{endpoint.path}</code>
                                    </div>
                                    <p className="text-gray-400">{endpoint.description}</p>
                                </div>

                                <div className="p-6 bg-black/20">
                                    <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Parameters</h4>
                                    <div className="space-y-4 mb-8">
                                        {endpoint.params.map((param, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 text-sm">
                                                <div className="w-32 font-mono text-blue-400 shrink-0">
                                                    {param.name}
                                                    {param.required && <span className="text-red-400 ml-1">*</span>}
                                                </div>
                                                <div className="w-24 text-gray-500 shrink-0">{param.type}</div>
                                                <div className="text-gray-400">{param.desc}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Example Request</h4>
                                    <div className="bg-black rounded-xl p-4 overflow-x-auto">
                                        <pre className="text-sm font-mono text-gray-300">
                                            {endpoint.example}
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APIReference;
