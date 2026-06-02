import { prisma } from '../lib/prisma.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Validasi label dropdown sesuai Figma (tanpa titik)
const VALID_INGREDIENTS = ['Ayam', 'Sapi', 'Telur'];
const VALID_RANGES = [
  '<= 10000',
  '11000 - 15000',
  '16000 - 20000',
  '21000 - 25000',
  '>= 25000',
];


// POST /api/recommend  (Protected)

export async function recommend(req, res) {
  try {
    const { ingredient, priceRange } = req.body;

    // Validasi input
    if (!VALID_INGREDIENTS.includes(ingredient)) {
      return res.status(400).json({
        message: `Bahan utama tidak valid. Pilihan: ${VALID_INGREDIENTS.join(', ')}.`,
      });
    }
    if (!VALID_RANGES.includes(priceRange)) {
      return res.status(400).json({
        message: `Rentang harga tidak valid. Pilihan: ${VALID_RANGES.join(' / ')}.`,
      });
    }

    // Panggil AI Service
    let aiResponse;
    try {
      aiResponse = await fetch(`${AI_SERVICE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient, priceRange }),
        // Timeout 10 detik agar tidak hang
        signal: AbortSignal.timeout(10000),
      });
    } catch (fetchErr) {
      console.error('AI Service unreachable:', fetchErr.message);
      return res.status(503).json({
        message:
          'AI Service tidak dapat dijangkau. Pastikan service berjalan di port 8000.',
      });
    }

    // Kalau AI return error
    if (!aiResponse.ok) {
      const errBody = await aiResponse.json().catch(() => ({}));
      console.error('AI Service returned error:', aiResponse.status, errBody);
      return res.status(aiResponse.status).json({
        message:
          errBody.detail || errBody.message || 'AI Service mengembalikan error.',
      });
    }

    const aiData = await aiResponse.json();

    // Kalau tidak ada menu yang cocok, forward 404
    if (aiData.status === 'not_found') {
      return res.status(404).json(aiData);
    }

    // Simpan history user (non-blocking)
    prisma.prediction
      .create({
        data: {
          userId: req.user.userId,
          ingredient,
          priceRange,
          menuName: aiData.menu_terbaik.name,
          menuImage: aiData.menu_terbaik.image,
          skor: aiData.menu_terbaik.skor_regresi,
          kategori: aiData.menu_terbaik.kategori_kelayakan,
        },
      })
      .catch((err) => console.error('Failed to save history:', err));

    // Forward response AI ke frontend
    return res.json(aiData);
  } catch (err) {
    console.error('Recommend error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}

// GET /api/recommend/history  (Protected)

export async function history(req, res) {
  try {
    const items = await prisma.prediction.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return res.json({ items });
  } catch (err) {
    console.error('History error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}
