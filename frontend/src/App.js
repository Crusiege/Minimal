import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Heart, User, Calendar, Eye, Plus, Menu, X, LogOut } from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

// AuthForm component - optimized to prevent weird behaviors
const AuthForm = React.memo(({ isLogin = true, formData, setFormData, handleLogin, loading, error, setCurrentView, setError }) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Reset form state when switching between login/signup
  useEffect(() => {
    setFieldErrors({});
    setTouched({});
    setShowPassword(false);
    setError('');
  }, [isLogin, setError]);

  // Validation functions - memoized to prevent recreation
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePassword = useCallback((password) => {
    if (!password || password.length < 6) return false;
    
    // Must contain at least one lowercase letter, one uppercase letter, and one number
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasLowercase && hasUppercase && hasNumber;
  }, []);

  const validateName = useCallback((name) => {
    return name && name.trim().length >= 2;
  }, []);

  const getPasswordStrength = useCallback((password) => {
    if (!password || password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: 'Too short' };
    
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    
    // Check if it meets minimum requirements
    if (!hasLowercase || !hasUppercase || !hasNumber) {
      return { strength: 2, text: 'Weak - Missing required characters' };
    }
    
    let score = 3; // Base score for meeting minimum requirements
    if (password.length >= 8) score++;
    if (hasSpecialChar) score++;

    if (score === 3) return { strength: 3, text: 'Good' };
    if (score === 4) return { strength: 4, text: 'Strong' };
    return { strength: 4, text: 'Very Strong' };
  }, []);

  // Handle field changes with validation - optimized
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear global error when user starts typing
    if (error) setError('');
    
    // Only validate if field has been touched
    if (touched[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        
        switch (field) {
          case 'name':
            if (!validateName(value)) {
              newErrors.name = 'Name must be at least 2 characters';
            } else {
              delete newErrors.name;
            }
            break;
          case 'email':
            if (!validateEmail(value)) {
              newErrors.email = 'Please enter a valid email address';
            } else {
              delete newErrors.email;
            }
            break;
                case 'password':
        if (!validatePassword(value)) {
          if (!value || value.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
          } else {
            newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
          }
        } else {
          delete newErrors.password;
        }
        break;
        }
        
        return newErrors;
      });
    }
  }, [formData, setFormData, error, setError, touched, validateName, validateEmail, validatePassword]);

  // Handle field blur - optimized
  const handleFieldBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const value = formData[field];
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      
      switch (field) {
        case 'name':
          if (!validateName(value)) {
            newErrors.name = 'Name must be at least 2 characters';
          } else {
            delete newErrors.name;
          }
          break;
        case 'email':
          if (!validateEmail(value)) {
            newErrors.email = 'Please enter a valid email address';
          } else {
            delete newErrors.email;
          }
          break;
        case 'password':
          if (!validatePassword(value)) {
            if (!value || value.length < 6) {
              newErrors.password = 'Password must be at least 6 characters long';
            } else {
              newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
            }
          } else {
            delete newErrors.password;
          }
          break;
      }
      
      return newErrors;
    });
  }, [formData, validateName, validateEmail, validatePassword]);

  // Handle form submission - optimized
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = { email: true, password: true };
    if (!isLogin) allTouched.name = true;
    setTouched(allTouched);
    
    // Validate all fields
    const newFieldErrors = {};
    
    if (!isLogin && !validateName(formData.name)) {
      newFieldErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!validateEmail(formData.email)) {
      newFieldErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      if (!formData.password || formData.password.length < 6) {
        newFieldErrors.password = 'Password must be at least 6 characters long';
      } else {
        newFieldErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
      }
    }
    
    setFieldErrors(newFieldErrors);
    
    // If no field errors, proceed with login
    if (Object.keys(newFieldErrors).length === 0) {
      handleLogin(!isLogin);
    }
  }, [isLogin, formData, validateName, validateEmail, validatePassword, handleLogin]);

  const handleSwitchView = useCallback(() => {
    setCurrentView(isLogin ? 'signup' : 'login');
    setError('');
  }, [isLogin, setCurrentView, setError]);

  // Memoized computed values
  const passwordStrength = useMemo(() => 
    !isLogin ? getPasswordStrength(formData.password) : null,
    [isLogin, formData.password, getPasswordStrength]
  );

  const isFormValid = useMemo(() => {
    const hasErrors = Object.keys(fieldErrors).length > 0;
    const hasRequiredFields = formData.email && formData.password && (isLogin || formData.name);
    return !hasErrors && hasRequiredFields;
  }, [fieldErrors, formData, isLogin]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Join our community of writers'}</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="form-fields" noValidate>
          {!isLogin && (
            <div className="form-field">
              <input
                type="text"
                placeholder="Full name"
                value={formData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                disabled={loading}
                className={fieldErrors.name ? 'error' : ''}
                autoFocus
                autoComplete="name"
              />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </div>
          )}
          
          <div className="form-field">
            <input
              type="email"
              placeholder="Email address"
              value={formData.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              disabled={loading}
              className={fieldErrors.email ? 'error' : ''}
              autoFocus={isLogin}
              autoComplete="email"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>
          
          <div className="form-field">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password || ''}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onBlur={() => handleFieldBlur('password')}
                disabled={loading}
                className={fieldErrors.password ? 'error' : ''}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            
            {!isLogin && (
              <>
                {formData.password && passwordStrength && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div 
                        className={`strength-bar strength-${passwordStrength.strength}`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`strength-text strength-${passwordStrength.strength}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
                <div className="password-requirements">
                  <small>Password must contain at least one lowercase letter, one uppercase letter, and one number</small>
                </div>
              </>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="auth-submit-btn"
          >
            {loading ? (
              <span className="loading-content">
                <span className="loading-spinner"></span>
                Please wait...
              </span>
            ) : (
              isLogin ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>
        
        <div className="auth-switch">
          <button
            type="button"
            onClick={handleSwitchView}
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
});

// PostDetail component - shows full post content
// Dashboard component - shows user's posts
const Dashboard = ({ user, posts, onViewPost, onDeletePost, loading, error }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Posts</h1>
        <p>Manage your published posts</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading your posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>You haven't published any posts yet. Create your first post to get started!</p>
        </div>
      ) : (
        <div className="dashboard-posts">
          {posts.map(post => (
            <div key={post._id} className="dashboard-post-item">
              <div className="post-info">
                <h3 className="post-title" onClick={() => onViewPost(post)}>{post.title}</h3>
                <p className="post-excerpt">{post.excerpt || `${post.content.substring(0, 150)}...`}</p>
                <div className="post-meta">
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <div className="post-stats">
                    <span className="views">
                      <Eye className="icon" />
                      {(post.views || 0).toLocaleString()}
                    </span>
                    <span className="likes">
                      <Heart className="icon" />
                      {(post.likes?.length || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="post-actions">
                <button 
                  onClick={() => onViewPost(post)}
                  className="view-btn"
                  title="View post"
                >
                  View
                </button>
                <button 
                  onClick={() => onDeletePost(post._id)}
                  className="delete-btn"
                  title="Delete post"
                >
                  <X className="icon" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PostDetail = ({ post, user, onBack, onToggleLike, onIncrementView, onDelete }) => {
  const isLikedByUser = user && post.isLikedByUser;
  const isAuthor = user && post.author && (user._id === post.author._id || user._id === post.author);
  const viewedRef = useRef(null);

  // Increment view count only once when post detail mounts for a new post
  useEffect(() => {
    if (post && post._id && viewedRef.current !== post._id) {
      viewedRef.current = post._id;
      onIncrementView(post._id);
    }
  }, [post._id, onIncrementView]);

  return (
    <div className="post-detail-container">
      <div className="post-detail">
        <div className="post-detail-header">
          <button onClick={onBack} className="back-btn">
            ← Back to posts
          </button>
        </div>

        <article className="post-detail-content">
          <div className="post-meta">
            <div className="author-info">
              <span className="author-name">{post.author?.name || 'Anonymous'}</span>
              <span className="separator">•</span>
              <div className="date-info">
                <Calendar className="icon" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            <div className="post-stats">
                           <div className="views">
               <Eye className="icon" />
               <span>{(post.views || 0).toLocaleString()} {post.views === 1 ? 'view' : 'views'}</span>
             </div>
              <button 
                onClick={() => onToggleLike(post._id)}
                className={`like-btn ${isLikedByUser ? 'liked' : ''}`}
                disabled={!user}
              >
                <Heart className={`icon ${isLikedByUser ? 'filled' : ''}`} />
                <span>{post.likesCount || post.likes?.length || 0}</span>
              </button>
              {isAuthor && (
                <button 
                  onClick={() => onDelete(post._id)}
                  className="delete-btn"
                  title="Delete post"
                >
                  <X className="icon" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="post-detail-title">{post.title}</h1>
          
          <div className="post-detail-body">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

// CreatePost component - moved outside to prevent recreation on every render
const CreatePost = ({ newPost, setNewPost, handleCreatePost, loading, error, setCurrentView, setError }) => (
  <div className="create-post-container">
    <div className="create-post-form">
      <h1>Write a new post</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="post-form">
        <input
          type="text"
          placeholder="Post title..."
          value={newPost.title}
          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
          className="title-input"
          disabled={loading}
        />
        
        <div className="content-section">
          <textarea
            placeholder="Tell your story..."
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            className="content-input"
            disabled={loading}
          />
        </div>
        
        <div className="form-actions">
          <button
            onClick={() => {
              setCurrentView('home');
              setError('');
            }}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePost}
            disabled={loading || !newPost.title || !newPost.content}
            className="publish-btn"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [currentView, setCurrentView] = useState('home'); // home, login, signup, create, post, dashboard
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  // API Functions
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || 'Something went wrong');
        // Include validation errors if they exist
        if (data.errors) {
          error.errors = data.errors;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      if (error.errors) {
        // Pass through validation errors
        const validationError = new Error(error.message);
        validationError.errors = error.errors;
        throw validationError;
      }
      throw new Error(error.message);
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall('/posts');
      // Handle the correct API response structure
      setPosts(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const incrementView = useCallback(async (postId) => {
    try {
      const response = await apiCall(`/posts/${postId}/view`, {
        method: 'PUT'
      });

      // Update the view count in the posts array
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? { ...post, views: (post.views || 0) + 1 } : post
        )
      );

      // Update current post if viewing detailed view
      setCurrentPost(prev => 
        prev && prev._id === postId 
          ? { ...prev, views: (prev.views || 0) + 1 }
          : prev
      );
    } catch (error) {
      // Silently fail for view increments
      console.error(error);
    }
  }, []);

  const fetchUserPosts = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await apiCall(`/posts/user/${user._id}`);
      setUserPosts(response.data || []);
    } catch (error) {
      setError(error.message || 'Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deletePost = useCallback(async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiCall(`/posts/${postId}`, {
        method: 'DELETE'
      });

      // Remove the post from the posts array
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

      // Remove from user posts if in dashboard
      setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

      // If we're viewing the deleted post, go back to home
      if (currentPost && currentPost._id === postId) {
        setCurrentPost(null);
        setCurrentView('home');
      }

      // Show success message
      alert('Post deleted successfully!');
    } catch (error) {
      setError(error.message || 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  }, [currentPost]);

  const fetchPost = useCallback(async (postId) => {
    try {
      setLoading(true);
      const response = await apiCall(`/posts/${postId}`);
      setCurrentPost(response.data);
      setCurrentView('post');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const viewPost = useCallback((post) => {
    setCurrentPost(post);
    setCurrentView('post');
  }, []);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    fetchPosts();
  }, [fetchPosts]);

  // Fetch user posts when user changes
  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user, fetchUserPosts]);

  // Reset form data when switching between views
  useEffect(() => {
    if (currentView === 'login' || currentView === 'signup') {
      setFormData({ email: '', password: '', name: '' });
      setError('');
    }
  }, [currentView]);

  const handleLogin = useCallback(async (isSignup = false) => {
    const requiredFields = isSignup 
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };
    
    const missingFields = Object.entries(requiredFields).filter(([key, value]) => !value);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const payload = isSignup 
        ? { name: formData.name.trim(), email: formData.email.trim(), password: formData.password }
        : { email: formData.email.trim(), password: formData.password };

      const data = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setCurrentView('home');
      setFormData({ email: '', password: '', name: '' });
      
      // Refresh posts after login to get user-specific data
      fetchPosts();
    } catch (error) {
      // If it's a validation error with details, show those; otherwise show the general message
      if (error.message === 'Validation failed' && error.errors) {
        const errorMessages = error.errors.map(err => err.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, setError, fetchPosts]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('home');
    setFormData({ email: '', password: '', name: '' });
    fetchPosts(); // Refresh posts to remove user-specific data
  }, [fetchPosts]);

  const handleCreatePost = useCallback(async () => {
    if (!newPost.title?.trim() || !newPost.content?.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiCall('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: newPost.title.trim(),
          content: newPost.content.trim()
        })
      });

      // Add new post to the beginning of the posts array
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setNewPost({ title: '', content: '' });
      setCurrentView('home');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [newPost, setError]);

  const toggleLike = useCallback(async (postId) => {
    if (!user) {
      setError('Please login to like posts');
      return;
    }

    try {
      const response = await apiCall(`/posts/${postId}/like`, {
        method: 'PUT'
      });

      // Update the post in the posts array
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );

      // Update current post if viewing detailed view
      if (currentPost && currentPost._id === postId) {
        setCurrentPost(response.data);
      }
    } catch (error) {
      setError(error.message);
    }
  }, [user, setError, currentPost]);

  const Header = () => (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1 onClick={() => setCurrentView('home')}>
              Minimal
            </h1>
          </div>
          
          <nav className="desktop-nav">
            <button 
              onClick={() => setCurrentView('home')}
              className={currentView === 'home' || currentView === 'post' ? 'active' : ''}
            >
              Home
            </button>
            {user ? (
              <>
                <button 
                  onClick={() => setCurrentView('create')}
                  className={currentView === 'create' ? 'active' : ''}
                >
                  Write
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('dashboard');
                    fetchUserPosts();
                  }}
                  className={currentView === 'dashboard' ? 'active' : ''}
                >
                  Dashboard
                </button>
                <div className="user-dropdown">
                  <div className="user-info">
                    <User className="icon" />
                    <span>{user.name}</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  <div className="dropdown-menu">
                    <button onClick={handleLogout} className="logout-btn">
                      <LogOut className="icon" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentView('login')}
                  className="nav-link"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setCurrentView('signup')}
                  className="signup-btn"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>

          <button 
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="mobile-nav">
            <button 
              onClick={() => { setCurrentView('home'); setShowMobileMenu(false); }}
            >
              Home
            </button>
            {user ? (
              <>
                <button 
                  onClick={() => { setCurrentView('create'); setShowMobileMenu(false); }}
                >
                  Write
                </button>
                <button 
                  onClick={() => { 
                    setCurrentView('dashboard'); 
                    setShowMobileMenu(false);
                    fetchUserPosts();
                  }}
                >
                  Dashboard
                </button>
                <div className="user-info">
                  <User className="icon" />
                  <span>{user.name}</span>
                </div>
                <button 
                  onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                >
                  <LogOut className="icon" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setCurrentView('login'); setShowMobileMenu(false); }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setCurrentView('signup'); setShowMobileMenu(false); }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );

  const BlogPost = ({ post, onViewPost }) => {
    const isLikedByUser = user && post.isLikedByUser;
    
    const handlePostClick = () => {
      onViewPost(post);
    };

    const handleReadMore = (e) => {
      e.stopPropagation();
      onViewPost(post);
    };

    return (
      <article className="blog-post" onClick={handlePostClick}>
        <div className="post-content">
          <div className="post-meta">
            <div className="author-info">
              <span className="author-name">{post.author?.name || 'Anonymous'}</span>
              <span className="separator">•</span>
              <div className="date-info">
                <Calendar className="icon" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="post-stats">
              <div className="views">
                <Eye className="icon" />
                <span>{(post.views || 0).toLocaleString()}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(post._id);
                }}
                className={`like-btn ${isLikedByUser ? 'liked' : ''}`}
                disabled={!user}
              >
                <Heart className={`icon ${isLikedByUser ? 'filled' : ''}`} />
                <span>{post.likesCount || post.likes?.length || 0}</span>
              </button>
            </div>
          </div>
          
          <h2 className="post-title">{post.title}</h2>
          
          <p className="post-excerpt">
            {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
          </p>
          
          {post.content.length > 200 && (
            <div className="read-more" onClick={handleReadMore}>
              <span>Read more →</span>
            </div>
          )}
        </div>
      </article>
    );
  };





  const HomePage = () => (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Stories worth reading</h1>
            <p>
              Discover perspectives, insights, and stories from writers who care about craft and clarity.
            </p>
            {!user && (
              <button 
                onClick={() => setCurrentView('signup')}
                className="cta-btn"
              >
                Start reading
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="container">
          <div className="error-message">
            {error}
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="posts-container">
        <div className="container">
          {loading && posts.length === 0 ? (
            <div className="loading-state">
              <div>Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div>No posts yet. Be the first to write something!</div>
              {user && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="cta-btn"
                >
                  Write a post
                </button>
              )}
            </div>
          ) : (
                      <div className="posts-grid">
            {posts.map(post => (
              <BlogPost key={post._id} post={post} onViewPost={viewPost} />
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {user && (
        <button
          onClick={() => setCurrentView('create')}
          className="fab"
        >
          <Plus />
        </button>
      )}
    </div>
  );

  return (
    <div className="app">
      <Header />
      
      {currentView === 'home' && <HomePage />}
      {currentView === 'post' && currentPost && (
        <PostDetail 
          post={currentPost} 
          user={user}
          onBack={() => setCurrentView('home')}
          onToggleLike={toggleLike}
          onIncrementView={incrementView}
          onDelete={deletePost}
        />
      )}
      {currentView === 'login' && (
        <AuthForm 
          isLogin={true} 
          formData={formData} 
          setFormData={setFormData} 
          handleLogin={handleLogin} 
          loading={loading} 
          error={error} 
          setCurrentView={setCurrentView} 
          setError={setError} 
        />
      )}
      {currentView === 'signup' && (
        <AuthForm 
          isLogin={false} 
          formData={formData} 
          setFormData={setFormData} 
          handleLogin={handleLogin} 
          loading={loading} 
          error={error} 
          setCurrentView={setCurrentView} 
          setError={setError} 
        />
      )}
      {currentView === 'create' && user && (
        <CreatePost 
          newPost={newPost} 
          setNewPost={setNewPost} 
          handleCreatePost={handleCreatePost} 
          loading={loading} 
          error={error} 
          setCurrentView={setCurrentView} 
          setError={setError} 
        />
      )}
      {currentView === 'dashboard' && user && (
        <Dashboard 
          user={user}
          posts={userPosts}
          onViewPost={viewPost}
          onDeletePost={deletePost}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default App; 