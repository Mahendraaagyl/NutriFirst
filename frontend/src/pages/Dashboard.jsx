import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const INGREDIENTS = ['Ayam', 'Sapi', 'Telur'];
const RANGES = [
  '<= 10.000',
  '11.000 - 15.000',
  '16.000 - 20.000',
  '21.000 - 25.000',
  '>= 25.000',
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [ingredient, setIngredient] = useState('Ayam');
  const [priceRange, setPriceRange] = useState('11.000 - 15.000');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.post('/recommend', { ingredient, priceRange });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil rekomendasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white"> NutriFirst</h1>
            <p className="text-white/80">Halo, {user?.name}!</p>
          </div>
          <button
            onClick={logout}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur"
          >
            Logout
          </button>
        </header>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-tosca mb-4">Cari Rekomendasi Menu</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Bahan Utama
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tosca"
                value={ingredient}
                onChange={e => setIngredient(e.target.value)}
              >
                {INGREDIENTS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Range Harga (Rp)
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tosca"
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
              >
                {RANGES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tosca hover:bg-tosca-dark text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Memproses...' : ' Cari Rekomendasi'}
              </button>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6">
             {error}
          </div>
        )}

        {/* Result */}
        {result && result.menu && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-tosca mb-4"> Menu Rekomendasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={result.menu.image}
                alt={result.menu.name}
                className="w-full h-64 object-cover rounded-xl shadow"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{result.menu.name}</h3>
                <p className="text-gray-500 capitalize mb-3">Bahan: {result.menu.bahan_dasar}</p>

                <div className="bg-tosca/10 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600">Skor Kelayakan Gizi</p>
                  <p className="text-3xl font-bold text-tosca">
                    {result.prediksi.skor_regresi}
                    <span className="text-sm text-gray-500"> / 100</span>
                  </p>
                  <p className="text-tosca font-semibold mt-1">
                    {result.prediksi.kategori_kelayakan}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Info label="Kalori" value={`${result.menu.calories} kkal`} />
                  <Info label="Protein" value={`${result.menu.proteins} g`} />
                  <Info label="Lemak" value={`${result.menu.fat} g`} />
                  <Info label="Karbohidrat" value={`${result.menu.carbohydrate} g`} />
                  <Info label="Harga" value={`Rp ${result.menu.harga.toLocaleString('id-ID')}`} colSpan />
                </div>
              </div>
            </div>

            {/* Alternatif */}
            {result.alternatif && result.alternatif.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Alternatif Menu:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.alternatif.map(alt => (
                    <div key={alt.id} className="bg-gray-50 rounded-lg p-3 flex gap-3">
                      <img src={alt.image} alt={alt.name} className="w-16 h-16 object-cover rounded"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{alt.name}</p>
                        <p className="text-xs text-gray-500">Skor: {alt.skor}</p>
                        <p className="text-xs text-gray-500">Rp {alt.harga.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No result */}
        {result && !result.menu && (
          <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
             Tidak ada menu yang cocok dengan kriteria. Coba kombinasi lain.
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, colSpan }) {
  return (
    <div className={`bg-gray-50 rounded-lg p-2 ${colSpan ? 'col-span-2' : ''}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}