import React from 'react';
import { ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 text-white py-20">
            <div className="container mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                            Create Amazing Affiliate Blogs on Autopilot
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
                            AffPilot uses advanced AI to automatically research, write, and publish high-quality, SEO-optimized blog content that drives affiliate sales.
                        </p>
                    </div>
                    <div className="md:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
                        <div className="relative">
                            <div className="absolute -top-8 -left-8 w-64 h-64 bg-purple-300/30 rounded-full filter blur-3xl"></div>
                            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-800/30 rounded-full filter blur-3xl"></div>
                            <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                                    alt="Affpilot AI Autoblogging Software"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
