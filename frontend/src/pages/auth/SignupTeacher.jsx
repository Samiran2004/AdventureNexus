import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GradientBars } from '@/components/ui/gradient-bars';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import '../../css/TeacherSignupPage.css';

const TeacherSignup = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        // Teacher Personal Info
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        gender: '',
        profile_image_url: '',
        
        // Address Information (will be converted to addressId)
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const { signUpTeacher } = useAuthStore();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Handle phone number - only allow numbers
        if (name === 'phone_number') {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    profile_image: 'Please select a valid image file'
                }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    profile_image: 'Image size should be less than 5MB'
                }));
                return;
            }

            setImageFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setFormData(prev => ({
                    ...prev,
                    profile_image_url: e.target.result // In real app, this would be uploaded to server
                }));
            };
            reader.readAsDataURL(file);

            // Clear error
            if (errors.profile_image) {
                setErrors(prev => ({
                    ...prev,
                    profile_image: ''
                }));
            }
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            // Personal Information Validation
            if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
            if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
            
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
            
            if (!formData.phone_number.trim()) {
                newErrors.phone_number = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phone_number)) {
                newErrors.phone_number = 'Phone number must be exactly 10 digits';
            }
            
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters long';
            }
            
            if (!formData.confirm_password) {
                newErrors.confirm_password = 'Please confirm your password';
            } else if (formData.password !== formData.confirm_password) {
                newErrors.confirm_password = 'Passwords do not match';
            }
            
            if (!formData.gender) {
                newErrors.gender = 'Please select your gender';
            }
        }

        if (step === 2) {
            // Address Information Validation
            if (!formData.street.trim()) newErrors.street = 'Street address is required';
            if (!formData.city.trim()) newErrors.city = 'City is required';
            if (!formData.state.trim()) newErrors.state = 'State is required';
            
            if (!formData.postal_code.trim()) {
                newErrors.postal_code = 'Postal code is required';
            } else if (!/^\d{6}$/.test(formData.postal_code)) {
                newErrors.postal_code = 'Postal code must be 6 digits';
            }
            
            if (!formData.country.trim()) newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!validateStep(2)) return;

        setLoading(true);

        try {
            // Prepare data for submission
            const submitData = {
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone_number: parseInt(formData.phone_number), // Convert to int
                password: formData.password, // Will be hashed by backend
                profile_image_url: formData.profile_image_url || '',
                gender: formData.gender, // enum: 'male' or 'female'
                // Address will be created separately and addressId will be returned
                address: {
                    street: formData.street.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    postal_code: formData.postal_code.trim(),
                    country: formData.country.trim()
                }
            };

            console.log("📝 Submitting teacher data:", submitData);
            const result = await signUpTeacher(submitData);

            if (result?.success) {
                navigate('/login', {
                    state: {
                        message: '🎉 Teacher registration successful! Please login to continue.',
                        email: formData.email,
                        userType: 'teacher'
                    }
                });
            } else {
                setErrors({ submit: result?.error || 'Registration failed. Please try again.' });
            }
        } catch (err) {
            console.error("❌ Submit error:", err);
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-step">
                        <h3 className="step-title">Personal Information</h3>

                        {/* Profile Image Upload */}
                        <div className="form-group profile-upload">
                            <Label className="form-label">Profile Picture (Optional)</Label>
                            <div className="image-upload-container">
                                <div 
                                    className="image-upload-area"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <Avatar className="upload-avatar">
                                            <AvatarImage src={imagePreview} alt="Profile" />
                                            <AvatarFallback>
                                                <User size={40} />
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Camera size={40} />
                                            <span>Click to upload photo</span>
                                        </div>
                                    )}
                                    <div className="upload-overlay">
                                        <Camera size={20} />
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden-file-input"
                                />
                            </div>
                            {errors.profile_image && <span className="error-text">{errors.profile_image}</span>}
                        </div>

                        {/* Name Fields */}
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="first_name" className="form-label">First Name *</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    placeholder="Enter first name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.first_name ? 'error' : ''}`}
                                />
                                {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="last_name" className="form-label">Last Name *</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    placeholder="Enter last name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.last_name ? 'error' : ''}`}
                                />
                                {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <Label htmlFor="email" className="form-label">Email Address *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`form-input ${errors.email ? 'error' : ''}`}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        {/* Phone and Gender */}
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="phone_number" className="form-label">Phone Number *</Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    placeholder="Enter 10-digit phone number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    maxLength="10"
                                    className={`form-input ${errors.phone_number ? 'error' : ''}`}
                                />
                                {errors.phone_number && <span className="error-text">{errors.phone_number}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="gender" className="form-label">Gender *</Label>
                                <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                                    <SelectTrigger className={`form-input ${errors.gender ? 'error' : ''}`}>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <span className="error-text">{errors.gender}</span>}
                            </div>
                        </div>

                        {/* Password Fields */}
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="password" className="form-label">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter password (min 6 characters)"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                />
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="confirm_password" className="form-label">Confirm Password *</Label>
                                <Input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                                />
                                {errors.confirm_password && <span className="error-text">{errors.confirm_password}</span>}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="form-step">
                        <h3 className="step-title">Address Information</h3>

                        {/* Street Address */}
                        <div className="form-group">
                            <Label htmlFor="street" className="form-label">Street Address *</Label>
                            <Textarea
                                id="street"
                                name="street"
                                placeholder="Enter complete street address"
                                value={formData.street}
                                onChange={handleInputChange}
                                rows={2}
                                className={`form-input ${errors.street ? 'error' : ''}`}
                            />
                            {errors.street && <span className="error-text">{errors.street}</span>}
                        </div>

                        {/* City and State */}
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="city" className="form-label">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.city ? 'error' : ''}`}
                                />
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="state" className="form-label">State *</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    type="text"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.state ? 'error' : ''}`}
                                />
                                {errors.state && <span className="error-text">{errors.state}</span>}
                            </div>
                        </div>

                        {/* Postal Code and Country */}
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="postal_code" className="form-label">Postal Code *</Label>
                                <Input
                                    id="postal_code"
                                    name="postal_code"
                                    type="text"
                                    placeholder="Enter 6-digit postal code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    maxLength="6"
                                    className={`form-input ${errors.postal_code ? 'error' : ''}`}
                                />
                                {errors.postal_code && <span className="error-text">{errors.postal_code}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="country" className="form-label">Country *</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    type="text"
                                    placeholder="Enter country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.country ? 'error' : ''}`}
                                />
                                {errors.country && <span className="error-text">{errors.country}</span>}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="teacher-signup-container">
            <GradientBars
                bars={25}
                colors={["#10b981", "#3b82f6", "transparent"]}
            />

            <div className="signup-content">
                <div className="signup-header">
                    <div className="school-logo">
                        <div className="logo-icon">👨‍🏫</div>
                        <h1 className="brand-title">SchoolSync</h1>
                        <div className="logo-icon">👩‍🏫</div>
                    </div>
                    <p className="welcome-text">Join our teaching community</p>
                </div>

                {/* Progress Indicator */}
                <div className="progress-indicator">
                    {[1, 2].map((step) => (
                        <div
                            key={step}
                            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                        >
                            <div className="step-number">{step}</div>
                            <div className="step-label">
                                {step === 1 && 'Personal Info'}
                                {step === 2 && 'Address'}
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="signup-card">
                    <CardHeader className="card-header">
                        <CardTitle className="card-title">Teacher Registration</CardTitle>
                        <CardDescription className="card-description">
                            Step {currentStep} of 2 - Please fill in all required information
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="card-content">
                        <form onSubmit={handleSubmit} className="signup-form">
                            {errors.submit && (
                                <Alert className="error-alert">
                                    <AlertDescription>{errors.submit}</AlertDescription>
                                </Alert>
                            )}

                            {renderStep()}

                            <div className="form-actions">
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="previous-button"
                                        onClick={handlePrevious}
                                    >
                                        Previous
                                    </Button>
                                )}

                                {currentStep < 2 ? (
                                    <Button
                                        type="button"
                                        className="next-button"
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="submit-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="loading-spinner">
                                                <div className="spinner"></div>
                                                Registering...
                                            </span>
                                        ) : (
                                            'Complete Registration'
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="signup-footer">
                    <p>Already have an account? <Link to="/login" className="signin-link">Sign In</Link></p>
                    <p>Looking for student registration? <Link to="/signup/student" className="student-link">Student Signup</Link></p>
                    <p className="copyright">© 2025 SchoolSync. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherSignup;