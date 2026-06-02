import { HiMiniTrophy } from "react-icons/hi2";
import { IoWarningOutline } from "react-icons/io5";
import { VscSparkleFilled } from "react-icons/vsc";

export default function ResultDisplay({ result }) {
  if (!result) return null;

  // Kasus tidak ditemukan
  if (result.status === 'not_found') {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
        <p className="text-yellow-300"> <IoWarningOutline className="text-yellow-400" /> {result.message}</p>
      </div>
    );
  }

  const { menu_terbaik, alternatif} = result;

  return (
    <div className="max-w-5xl mx-auto px-6 mt-12 mb-12 space-y-8">
      {/* Menu Terbaik */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center justify-center  text-2xl md:text-3xl font-bold text-white">
            <HiMiniTrophy className="text-yellow-300 mr-5"/> Menu Terbaik
          </h2>
          
        </div>

        <div className="bg-nutri-card rounded-3xl overflow-hidden shadow-2xl border border-tosca/20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Image */}
            <div className="md:col-span-2 h-64 md:h-auto">
              <img
                src={menu_terbaik.image}
                alt={menu_terbaik.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
            </div>

            {/* Info */}
            <div className="md:col-span-3 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                {menu_terbaik.name}
              </h3>
              <p className="text-tosca/80 capitalize mb-4">Bahan: {menu_terbaik.bahan_dasar}</p>

              {/* Skor */}
              <div className="bg-tosca/10 border border-tosca/30 rounded-2xl p-4 mb-4">
                <p className="text-xs text-white/60 uppercase tracking-wider">Skor Kelayakan Gizi (AI)</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold text-tosca">{menu_terbaik.skor_regresi}</span>
                  <span className="text-white/40">/ 100</span>
                </div>
                <p className="text-tosca font-semibold mt-1">{menu_terbaik.kategori_kelayakan}</p>
              </div>

              {/* Nutrisi Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <Info label="Kalori" value={`${menu_terbaik.calories} kkal`} />
                <Info label="Protein" value={`${menu_terbaik.proteins} g`} />
                <Info label="Lemak" value={`${menu_terbaik.fat} g`} />
                <Info label="Karbohidrat" value={`${menu_terbaik.carbohydrate} g`} />
                <Info label="Harga" value={`Rp ${menu_terbaik.harga.toLocaleString('id-ID')}`} colSpan />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternatif */}
      {alternatif && alternatif.length > 0 && (
        <div>
          <h3 className=" flex items-centertext-xl md:text-2xl font-bold text-white mb-4">
           <VscSparkleFilled className="text-yellow-300 mr-5"/> Alternatif Menu ({alternatif.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {alternatif.map((alt, idx) => (
              <AltCard key={alt.id} menu={alt} rank={idx + 2} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, colSpan }) {
  return (
    <div className={`bg-nutri-darker rounded-xl p-3 ${colSpan ? 'col-span-2 md:col-span-3' : ''}`}>
      <p className="text-xs text-white/50">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}

function AltCard({ menu, rank }) {
  return (
    <div className="bg-nutri-card border border-white/5 rounded-2xl overflow-hidden hover:border-tosca/40 hover:shadow-glow-sm transition">
      <div className="relative h-32">
        <img
          src={menu.image}
          alt={menu.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
        />
        <span className="absolute top-2 left-2 bg-tosca text-nutri-bg text-xs font-bold px-2 py-1 rounded-full">
          #{rank}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-white line-clamp-2 mb-1 min-h-[2.5rem]">
          {menu.name}
        </p>
        <p className="text-xs text-tosca font-bold">Skor: {menu.skor_regresi}</p>
        <p className="text-xs text-white/50">{menu.kategori_kelayakan}</p>
        <p className="text-xs text-white/70 mt-1">
          Rp {menu.harga.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}