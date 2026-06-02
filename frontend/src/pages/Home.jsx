import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Welcome to <span className="text-tosca">NutriFirst</span>
        </h1>
        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
          Platform rekomendasi gizi berbasis Deep Learning untuk hidup sehat tanpa
          menguras kantong.
        </p>
        <Link
          to="/our-product"
          className="inline-block bg-tosca hover:bg-tosca-light text-nutri-bg font-bold px-10 py-3 rounded-2xl shadow-glow transition hover:scale-105"
        >
          Mulai Sekarang
        </Link>
      </div>
    </section>
  );
}