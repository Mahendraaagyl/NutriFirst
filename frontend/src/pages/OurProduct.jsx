import { useState } from 'react';
import api from '../api/axios';
import Dropdown from '../components/Dropdown';
import ResultDisplay from '../components/ResultDisplay';

const INGREDIENTS = ['Ayam', 'Sapi', 'Telur'];
const PRICE_RANGES = [
  '<= 10000',
  '11000 - 15000',
  '16000 - 20000',
  '21000 - 25000',
  '>= 25000',
];

export default function OurProduct() {
  const [ingredient, setIngredient] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Validasi
    if (!ingredient) return setError('Pilih bahan utama terlebih dahulu.');
    if (!priceRange) return setError('Pilih perkiraan budget terlebih dahulu.');

    setLoading(true);
    try {
      const { data } = await api.post('/recommend', { ingredient, priceRange });
      setResult(data);
      // Auto-scroll ke hasil
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengambil rekomendasi.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-8 md:pt-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Buat harimu sehat dan bergizi!
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Yuk mulai perjalanan sehatmu! Masukkan preferensi makanan dan perkiraan
            budget mu hari ini!
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-6 md:px-12 mt-12 md:mt-16">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <Dropdown
              label="Mau makan apa hari ini?"
              options={INGREDIENTS}
              value={ingredient}
              onChange={setIngredient}
            />
            <Dropdown
              label="Perkiraan budget makan"
              options={PRICE_RANGES}
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>

          {/* Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="bg-tosca hover:bg-tosca-light text-nutri-bg font-bold px-10 py-3 rounded-2xl
                shadow-glow transition disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-105 active:scale-95"
            >
              {loading ? 'Memproses...' : 'Cari Rekomendasi'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="max-w-2xl mx-auto mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-300"> {error}</p>
            </div>
          )}
        </form>
      </section>

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="inline-flex items-center gap-3 text-tosca">
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4..." />
            </svg>
            <span>AI sedang menganalisis...</span>
          </div>
        </div>
      )}

      {/* Result Section */}
      <section id="result-section">
        <ResultDisplay result={result} />
      </section>
    </div>
  );
}