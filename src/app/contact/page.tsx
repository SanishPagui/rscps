"use client"
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Check if e.target exists and has name and value properties
        if (e && e.target && e.target.name) {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const handleSubmit = (e) => {
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }

            setIsSubmitting(true);

            // Simulate form submission
            setTimeout(() => {
                setIsSubmitting(false);
                setSubmitMessage('Thank you for your message. We will get back to you soon!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 1000);
        };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <Mail className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Email</h3>
                                            <p className="text-gray-600">support@rideshare.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <Phone className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Phone</h3>
                                            <p className="text-gray-600">+91 98765 43210</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MapPin className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Office</h3>
                                            <p className="text-gray-600">
                                                RideShare HQ<br />
                                                123 Tech Park, Panaji<br />
                                                Goa, 403001
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="font-medium mb-3">Office Hours</h3>
                                    <p className="text-gray-600">
                                        Monday - Friday: 9AM - 6PM<br />
                                        Saturday: 10AM - 2PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6">Send a Message</h2>

                                {submitMessage ? (
                                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
                                        {submitMessage}
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Your Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 flex items-center justify-center disabled:opacity-70"
                                        >
                                            {isSubmitting ? 'Sending...' : (
                                                <>
                                                    Send Message <Send className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="font-medium mb-3">Common Inquiries</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-600">• For booking issues, please include your booking ID</p>
                                        <p className="text-gray-600">• For technical support, please describe your device and browser</p>
                                        <p className="text-gray-600">• For payment concerns, our team typically responds within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;