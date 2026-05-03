import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MagneticButton from '../components/MagneticButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const data = await login(email, password);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] p-8 border border-[#222]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">Alta.</h1>
          <p className="text-[#cc3333] text-sm tracking-[0.2em]">ADMIN ACCESS</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="bg-transparent border-b border-[#333] py-3 text-white focus:outline-none focus:border-[#cc3333] transition-colors placeholder:text-[#555]"
            />
          </div>
          
          <div className="flex flex-col">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="bg-transparent border-b border-[#333] py-3 text-white focus:outline-none focus:border-[#cc3333] transition-colors placeholder:text-[#555]"
            />
          </div>

          <div className="mt-4">
            <MagneticButton 
              type="submit" 
              className={`w-full py-4 text-center border ${isLoading ? 'border-[#333] text-[#555]' : 'border-[#333] hover:border-white'} transition-colors uppercase tracking-[0.1em] text-sm`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Enter'}
            </MagneticButton>
          </div>
          
          {error && (
            <p className="text-[#cc3333] text-center text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
