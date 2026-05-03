import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      background: '#000000',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      background: '#0d0d0d',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '48px 40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
    },
    logo: {
      color: '#cc3333',
      fontSize: '22px',
      fontWeight: '900',
      letterSpacing: '0.1em',
      marginBottom: '8px',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.25em',
      color: 'rgba(255,255,255,0.35)',
      marginBottom: '32px',
      textAlign: 'center',
    },
    label: {
      display: 'block',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: 'rgba(255,255,255,0.35)',
      marginBottom: '6px',
    },
    input: (isFocused) => ({
      width: '100%',
      boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${isFocused ? 'rgba(204,51,51,0.6)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      padding: '11px 14px',
      outline: 'none',
      marginBottom: '20px',
      transition: 'border-color 0.2s ease',
    }),
    button: (isHovered, isDisabled) => ({
      width: '100%',
      height: '46px',
      background: isHovered ? '#aa2222' : '#cc3333',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      fontWeight: '700',
      cursor: isDisabled ? 'default' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      pointerEvents: isDisabled ? 'none' : 'auto',
      transition: 'background 0.2s ease',
    }),
    error: {
      marginTop: '-12px',
      marginBottom: '16px',
      color: '#cc3333',
      fontSize: '12px',
      textAlign: 'center',
    },
    successContainer: {
      textAlign: 'center',
    },
    checkmark: {
      fontSize: '40px',
      color: '#44c844',
      marginBottom: '16px',
    },
    successTitle: {
      color: 'white',
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '8px',
    },
    successText: {
      color: 'rgba(255,255,255,0.45)',
      fontSize: '13px',
      marginBottom: '24px',
    },
    loginLinkContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '6px',
      marginTop: '20px',
    },
    mutedText: {
      color: 'rgba(255,255,255,0.45)',
      fontSize: '12px',
    },
    link: {
      color: '#cc3333',
      fontSize: '12px',
      cursor: 'pointer',
      textDecoration: 'none',
    },
  };

  const [hoveredButton, setHoveredButton] = useState(false);

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successContainer}>
            <div style={styles.checkmark}>✓</div>
            <div style={styles.successTitle}>Account created successfully!</div>
            <div style={styles.successText}>You can now log in.</div>
            <button
              style={styles.button(hoveredButton, false)}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
              onClick={() => navigate('/login')}
            >
              GO TO LOGIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>ALTA.</div>
        <div style={styles.subtitle}>CREATE ACCOUNT</div>

        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input(focusedField === 'name')}
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />

          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input(focusedField === 'email')}
            type="email"
            placeholder="admin@altawebstudio.xyz"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input(focusedField === 'password')}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.button(hoveredButton, loading)}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
        </button>

        <div style={styles.loginLinkContainer}>
          <span style={styles.mutedText}>Already have an account?</span>
          <span style={styles.link} onClick={() => navigate('/login')}>
            Log in →
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
