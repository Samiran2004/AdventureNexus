import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GradientBars } from '@/components/ui/gradient-bars';
import '../css/LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Your login logic here
      console.log('Login attempt:', { email, password });

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        // Handle successful login or error
      }, 2000);

    } catch (err) {
      console.log("Error in login...", err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* GradientBars as background */}
      <GradientBars
        bars={30}
        colors={["#10b981", "#3b82f6", "transparent"]}
      />

      <div className="login-content">
        <div className="login-header">
          <div className="school-logo">
            <div className="logo-icon">🎓</div>
            <h1 className="brand-title">SchoolSync</h1>
            <div className="logo-icon">🎓</div>
          </div>
          <p className="welcome-text">Welcome back to your digital classroom</p>
        </div>

        <Card className="login-card">
          <CardHeader className="card-header">
            <CardTitle className="card-title">Log In</CardTitle>
            <CardDescription className="card-description">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="card-content">
            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <Alert className="error-alert">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="form-group">
                <Label htmlFor="email" className="form-label">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="password" className="form-label">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* <div className="form-options"> */}

              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
              {/* </div> */}

              <Button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <div className="spinner"></div>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup/student" className="signup-link">Create Account</Link></p>
          <p>OR</p>
          <p>Join as a Teacher? <Link to='/signup/teacher' className='signup-link'>Join</Link></p>
          <p className="copyright">© 2025 SchoolSync. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;