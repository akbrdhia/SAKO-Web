import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail } from '../utils/validation';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        setLockoutTime(null);
      }, lockoutTime);

      return () => clearTimeout(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleChange = (e) => {
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

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email/Username wajib diisi';
    } else if (formData.email.includes('@') && !validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if locked out
    if (isLocked) {
      setErrors({ 
        general: 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.' 
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Reset attempts on successful login
        setLoginAttempts(0);
        
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        navigate('/dashboard');
      } else {
        // Increment failed attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(300000); // 5 minutes
          setErrors({ 
            general: 'Terlalu banyak percobaan login gagal. Akun dikunci selama 5 menit.' 
          });
        } else {
          setErrors({ 
            general: result.message || 'Email/Username atau password salah',
            attempts: `Percobaan tersisa: ${5 - newAttempts}`
          });
        }
      }
    } catch {
      setErrors({ 
        general: 'Terjadi kesalahan. Silakan coba lagi.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 p-5">
        <div 
          className="w-full rounded-[20px] flex flex-col justify-center items-center px-12"
          style={{
            background: 'linear-gradient(to bottom, #005266 0%, #005266 15%, #A3BA0F 50%, #EBA51A 100%)'
          }}
        >
          <div>
            <h1 className="text-[42px] font-bold text-white mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
             SAKO - Sahabat Koperasi
            </h1>
            <p className="text-[22px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Platform digital terpadu untuk transformasi koperasi simpan pinjam Indonesia.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/assets/kemenkop/logo-kemenkop.png" 
              alt="Kemenkop" 
              className="h-16"
              onError={(e) => {
                // Fallback ke logo lain jika gagal load
                e.target.onerror = null;
                e.target.src = '/assets/kemenkop/logo kemenkop.png';
              }}
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang
            </h2>
            <p className="text-lg text-gray-600">
              Di <span className="text-teal-600 font-semibold">Sako</span>
            </p>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{errors.general}</p>
              {errors.attempts && (
                <p className="text-red-600 text-xs mt-1">{errors.attempts}</p>
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email/Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLocked || isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                  errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-white'
                } ${isLocked || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Masukkan email atau username"
                autoComplete="username"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLocked || isLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all pr-12 ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-white'
                  } ${isLocked || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLocked || isLoading}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className={`text-sm text-gray-700 ${isLocked || isLoading ? 'opacity-50' : ''}`}>
                  Ingat saya
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Lupa password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLocked || isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                isLocked || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-200'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Catatan:
                </h4>
                <p className="text-xs text-blue-700">
                  Pastikan Anda tidak membagikan informasi login kepada siapapun. Sako menggunakan keamanan 2FA untuk melindungi akun Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
