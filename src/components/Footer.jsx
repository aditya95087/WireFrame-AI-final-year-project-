import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 mt-20 pt-12 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">WireFrameAI</h3>
                    <p className="text-gray-400 text-sm">
                        Transforming ideas into technical reality with the power of AI.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/help" className="hover:text-highlight cursor-pointer transition-colors">Help Center</Link></li>
                        <li><Link to="/contact" className="hover:text-highlight cursor-pointer transition-colors">Contact Us</Link></li>
                        <li><Link to="/about" className="hover:text-highlight cursor-pointer transition-colors">About Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/docs" className="hover:text-highlight cursor-pointer transition-colors">Documentation</Link></li>
                        <li><Link to="/api" className="hover:text-highlight cursor-pointer transition-colors">API Reference</Link></li>


                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/privacy" className="hover:text-highlight cursor-pointer transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-highlight cursor-pointer transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                    © 2026 WireframeAI. Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Aditya Kumar.
                </p>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <Github size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    <Twitter size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                    <Linkedin size={20} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
