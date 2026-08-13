import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";

const ContactUs = () => {
  const navigate = useNavigate();
  const [state, handleSubmit] = useForm("xwvrqwwq");

  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded, navigate]);

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="z-10 flex flex-col items-center text-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl max-w-md mx-4"
        >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
                Thank you for reaching out. Our team will get back to you shortly. You will be redirected to the homepage.
            </p>
            <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium border border-white/5"
            >
                Return Home Now
            </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-purple-500/30">
      
      {/* Ambient Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Always Online
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Touch
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind or just want to say hi? We'd love to hear from you. Drop us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-[#111116]/80 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              {/* Card Hover Glow */}
              <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

                  <div className="space-y-8">
                    {/* Email */}
                    <div className="flex items-center gap-5 group/item">
                      <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                        <Mail className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-1">Email</h4>
                        <a href="mailto:support@wireframeai.com" className="text-white font-semibold text-lg hover:text-blue-400 transition-colors">support@wireframeai.com</a>
                      </div>
                    </div>

                    {/* Chat */}
                    <div className="flex items-center gap-5 group/item">
                      <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                        <MessageSquare className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-1">Live Chat</h4>
                        <p className="text-white font-semibold text-lg">Available Mon-Fri, 9am-5pm EST</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-5 group/item">
                      <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                        <Phone className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-1">Phone</h4>
                        <p className="text-white font-semibold text-lg">+1 (800) 123-4567</p>
                      </div>
                    </div>

                    {/* Office */}
                    <div className="flex items-center gap-5 group/item">
                      <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                        <MapPin className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-1">Office</h4>
                        <p className="text-white font-semibold text-lg">123 Innovation Dr, Tech City, TC 90210</p>
                      </div>
                    </div>

                  </div>
              </div>
            </div>

            {/* FAQ Box */}
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                     Quick Answers
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    Find quick answers to common questions about our platform in our Help Center.
                  </p>
                  <button onClick={() => navigate('/help')} className="text-white font-bold flex items-center gap-2 hover:text-purple-300 transition-colors group/btn bg-white/10 px-5 py-2.5 rounded-xl border border-white/5 hover:bg-white/20">
                    Visit Help Center <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
              </div>
            </div>

          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-7 bg-[#111116]/80 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-2">Send us a Message</h3>
                <p className="text-gray-400 mb-8">Fill out the form below and we will reply within 24 hours.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                          placeholder="john@example.com"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-xs mt-1" />
                      </div>
                  </div>

                  {/* Subject (Optional but looks good) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Your Message</label>
                    <textarea
                      name="message"
                      rows="5"
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                      placeholder="Tell us about your project or inquiry..."
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-xs mt-1" />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    {/* Button shine effect */}
                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] group-hover:animate-shine" />
                    
                    <span className="relative z-10">{state.submitting ? "Sending..." : "Send Message"}</span>
                    <Send size={18} className={`relative z-10 ${state.submitting ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'}`} />
                  </button>
                  
                  <p className="text-center text-xs text-gray-500 mt-4">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>

                </form>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;