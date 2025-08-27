import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientBars } from '@/components/ui/gradient-bars';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/StudentSignupPage.css';
import { useAuthStore } from '../../store/authStore';

const StudentSignup = () => {
    const [formData, setFormData] = useState({
        // Student details
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        gender: '',

        // Address details
        vill: '',
        post: '',
        pin: '',
        dist: '',
        state: '',

        // Father details
        father_first_name: '',
        father_last_name: '',
        father_email: '',
        father_phone_number: '',

        // Mother details
        mother_first_name: '',
        mother_last_name: '',
        mother_email: '',
        mother_phone_number: '',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { signUpStudent } = useAuthStore();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

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

    const validateStep = (step) => {
        console.log(`🔍 Validating step ${step}`);
        const newErrors = {};

        if (step === 1) {
            // Student details validation
            if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
            if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }
            if (!formData.phone_number.trim()) {
                newErrors.phone_number = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phone_number)) {
                newErrors.phone_number = 'Phone number must be 10 digits';
            }
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
            if (!formData.confirm_password) {
                newErrors.confirm_password = 'Please confirm password';
            } else if (formData.password !== formData.confirm_password) {
                newErrors.confirm_password = 'Passwords do not match';
            }
            if (!formData.gender) newErrors.gender = 'Please select gender';
        }

        if (step === 2) {
            // Address validation
            if (!formData.vill.trim()) newErrors.vill = 'Village/Area is required';
            if (!formData.post.trim()) newErrors.post = 'Post office is required';
            if (!formData.pin.trim()) {
                newErrors.pin = 'PIN code is required';
            } else if (!/^\d{6}$/.test(formData.pin)) {
                newErrors.pin = 'PIN code must be 6 digits';
            }
            if (!formData.dist.trim()) newErrors.dist = 'District is required';
            if (!formData.state.trim()) newErrors.state = 'State is required';
        }

        if (step === 3) {
            // Father details validation
            if (!formData.father_first_name.trim()) newErrors.father_first_name = 'Father first name is required';
            if (!formData.father_last_name.trim()) newErrors.father_last_name = 'Father last name is required';
            if (!formData.father_email.trim()) {
                newErrors.father_email = 'Father email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.father_email)) {
                newErrors.father_email = 'Father email is invalid';
            }
            if (!formData.father_phone_number.trim()) {
                newErrors.father_phone_number = 'Father phone number is required';
            } else if (!/^\d{10}$/.test(formData.father_phone_number)) {
                newErrors.father_phone_number = 'Father phone number must be 10 digits';
            }
        }

        if (step === 4) {
            // Mother details validation
            if (!formData.mother_first_name.trim()) newErrors.mother_first_name = 'Mother first name is required';
            if (!formData.mother_last_name.trim()) newErrors.mother_last_name = 'Mother last name is required';
            if (!formData.mother_email.trim()) {
                newErrors.mother_email = 'Mother email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.mother_email)) {
                newErrors.mother_email = 'Mother email is invalid';
            }
            if (!formData.mother_phone_number.trim()) {
                newErrors.mother_phone_number = 'Mother phone number is required';
            } else if (!/^\d{10}$/.test(formData.mother_phone_number)) {
                newErrors.mother_phone_number = 'Mother phone number must be 10 digits';
            }
        }

        console.log(`❗ Validation errors for step ${step}:`, newErrors);
        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log(`✅ Validation result for step ${step}:`, isValid);
        return isValid;
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
        console.log("🚀 handleSubmit called!");
        e.preventDefault();
        e.stopPropagation();

        console.log("📊 Current step:", currentStep);

        if (!validateStep(4)) {
            console.log("❌ Validation failed for step 4");
            return;
        }

        console.log("✅ Validation passed, setting loading");
        setLoading(true);

        try {
            console.log("📝 About to submit:", formData);
            const result = await signUpStudent(formData);
            console.log("📤 signUpStudent result:", result);

            if (result?.success) {
                console.log("✅ Registration successful!");
                // You can add navigation logic here
                // navigate('/login') or show success message
                navigate('/login');

            } else {
                console.log("❌ Registration failed:", result?.error);
                setErrors({ submit: result?.error || 'Registration failed' });
            }
        } catch (err) {
            console.error("❌ Submit error:", err);
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            console.log("🔄 Setting loading to false");
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-step">
                        <h3 className="step-title">Personal Information</h3>

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
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <span className="error-text">{errors.gender}</span>}
                            </div>
                        </div>

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

                        <div className="form-group">
                            <Label htmlFor="vill" className="form-label">Village/Area *</Label>
                            <Input
                                id="vill"
                                name="vill"
                                type="text"
                                placeholder="Enter village or area name"
                                value={formData.vill}
                                onChange={handleInputChange}
                                className={`form-input ${errors.vill ? 'error' : ''}`}
                            />
                            {errors.vill && <span className="error-text">{errors.vill}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="post" className="form-label">Post Office *</Label>
                                <Input
                                    id="post"
                                    name="post"
                                    type="text"
                                    placeholder="Enter post office"
                                    value={formData.post}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.post ? 'error' : ''}`}
                                />
                                {errors.post && <span className="error-text">{errors.post}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="pin" className="form-label">PIN Code *</Label>
                                <Input
                                    id="pin"
                                    name="pin"
                                    type="text"
                                    placeholder="Enter 6-digit PIN"
                                    value={formData.pin}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.pin ? 'error' : ''}`}
                                />
                                {errors.pin && <span className="error-text">{errors.pin}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="dist" className="form-label">District *</Label>
                                <Input
                                    id="dist"
                                    name="dist"
                                    type="text"
                                    placeholder="Enter district"
                                    value={formData.dist}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.dist ? 'error' : ''}`}
                                />
                                {errors.dist && <span className="error-text">{errors.dist}</span>}
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
                    </div>
                );

            case 3:
                return (
                    <div className="form-step">
                        <h3 className="step-title">Father's Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="father_first_name" className="form-label">First Name *</Label>
                                <Input
                                    id="father_first_name"
                                    name="father_first_name"
                                    type="text"
                                    placeholder="Enter father's first name"
                                    value={formData.father_first_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.father_first_name ? 'error' : ''}`}
                                />
                                {errors.father_first_name && <span className="error-text">{errors.father_first_name}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="father_last_name" className="form-label">Last Name *</Label>
                                <Input
                                    id="father_last_name"
                                    name="father_last_name"
                                    type="text"
                                    placeholder="Enter father's last name"
                                    value={formData.father_last_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.father_last_name ? 'error' : ''}`}
                                />
                                {errors.father_last_name && <span className="error-text">{errors.father_last_name}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <Label htmlFor="father_email" className="form-label">Email Address *</Label>
                            <Input
                                id="father_email"
                                name="father_email"
                                type="email"
                                placeholder="Enter father's email"
                                value={formData.father_email}
                                onChange={handleInputChange}
                                className={`form-input ${errors.father_email ? 'error' : ''}`}
                            />
                            {errors.father_email && <span className="error-text">{errors.father_email}</span>}
                        </div>

                        <div className="form-group">
                            <Label htmlFor="father_phone_number" className="form-label">Phone Number *</Label>
                            <Input
                                id="father_phone_number"
                                name="father_phone_number"
                                type="tel"
                                placeholder="Enter father's 10-digit phone number"
                                value={formData.father_phone_number}
                                onChange={handleInputChange}
                                className={`form-input ${errors.father_phone_number ? 'error' : ''}`}
                            />
                            {errors.father_phone_number && <span className="error-text">{errors.father_phone_number}</span>}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="form-step">
                        <h3 className="step-title">Mother's Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="mother_first_name" className="form-label">First Name *</Label>
                                <Input
                                    id="mother_first_name"
                                    name="mother_first_name"
                                    type="text"
                                    placeholder="Enter mother's first name"
                                    value={formData.mother_first_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.mother_first_name ? 'error' : ''}`}
                                />
                                {errors.mother_first_name && <span className="error-text">{errors.mother_first_name}</span>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="mother_last_name" className="form-label">Last Name *</Label>
                                <Input
                                    id="mother_last_name"
                                    name="mother_last_name"
                                    type="text"
                                    placeholder="Enter mother's last name"
                                    value={formData.mother_last_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.mother_last_name ? 'error' : ''}`}
                                />
                                {errors.mother_last_name && <span className="error-text">{errors.mother_last_name}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <Label htmlFor="mother_email" className="form-label">Email Address *</Label>
                            <Input
                                id="mother_email"
                                name="mother_email"
                                type="email"
                                placeholder="Enter mother's email"
                                value={formData.mother_email}
                                onChange={handleInputChange}
                                className={`form-input ${errors.mother_email ? 'error' : ''}`}
                            />
                            {errors.mother_email && <span className="error-text">{errors.mother_email}</span>}
                        </div>

                        <div className="form-group">
                            <Label htmlFor="mother_phone_number" className="form-label">Phone Number *</Label>
                            <Input
                                id="mother_phone_number"
                                name="mother_phone_number"
                                type="tel"
                                placeholder="Enter mother's 10-digit phone number"
                                value={formData.mother_phone_number}
                                onChange={handleInputChange}
                                className={`form-input ${errors.mother_phone_number ? 'error' : ''}`}
                            />
                            {errors.mother_phone_number && <span className="error-text">{errors.mother_phone_number}</span>}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="signup-container">
            <GradientBars
                bars={25}
                colors={["#10b981", "#3b82f6", "transparent"]}
            />

            <div className="signup-content">
                <div className="signup-header">
                    <div className="school-logo">
                        <div className="logo-icon">🎓</div>
                        <h1 className="brand-title">SchoolSync</h1>
                        <div className="logo-icon">🎓</div>
                    </div>
                    <p className="welcome-text">Join our digital learning community</p>
                </div>

                {/* Progress Indicator */}
                <div className="progress-indicator">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                        >
                            <div className="step-number">{step}</div>
                            <div className="step-label">
                                {step === 1 && 'Personal'}
                                {step === 2 && 'Address'}
                                {step === 3 && 'Father'}
                                {step === 4 && 'Mother'}
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="signup-card">
                    <CardHeader className="card-header">
                        <CardTitle className="card-title">Student Registration</CardTitle>
                        <CardDescription className="card-description">
                            Step {currentStep} of 4 - Please fill in all required information
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

                                {currentStep < 4 ? (
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
                    <p>OR</p>
                    <p>Join as a Teacher? <Link to='/signup/teacher' className='signin-link'>Join</Link></p>
                    <p className="copyright">© 2025 SchoolSync. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default StudentSignup;
