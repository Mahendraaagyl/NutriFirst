import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/our-product');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="bg-nutri-card border border-white/5 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">Daftar Akun</h1>
        <p className="text-white/60 mb-6">Mulai gunakan NutriFirst</p>

        {error && (
          <div className="bg-red-500/10 text-red-300 border border-red-500/30 rounded-xl p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Nama Lengkap" required
            className="w-full bg-nutri-darker border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-tosca placeholder-white/40"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email" placeholder="Email" required
            className="w-full bg-nutri-darker border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-tosca placeholder-white/40"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password" placeholder="Password (min 6 karakter)" required minLength={6}
            className="w-full bg-nutri-darker border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-tosca placeholder-white/40"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-tosca hover:bg-tosca-light text-nutri-bg font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-sm text-white/60 mt-6 text-center">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-tosca font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}