# ================================================================
# NUTRIFIRST DASHBOARD - REKOMENDASI MENU BERBASIS GIZI & HARGA
# ================================================================

import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
import warnings
warnings.filterwarnings('ignore')

# ================================================================
# KONFIGURASI HALAMAN
# ================================================================
st.set_page_config(
    page_title="NutriFirst - Rekomendasi Menu Gizi",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ================================================================
# CSS CUSTOM - WARNA TOSCA MODERN
# ================================================================
st.markdown("""
<style>
    /* Main background - Tosca Gelap */
    .stApp {
        background: linear-gradient(135deg, #006D5F 0%, #008B7A 100%);
    }
    
    /* Sidebar - Tosca Muda */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #E8F6F3 0%, #D1F2EB 100%);
        border-radius: 0 20px 20px 0;
    }
    
    [data-testid="stSidebar"] .stMarkdown, 
    [data-testid="stSidebar"] .stSelectbox label,
    [data-testid="stSidebar"] .stMultiSelect label,
    [data-testid="stSidebar"] .stSlider label {
        color: #006D5F !important;
        font-weight: 600 !important;
    }
    
    /* Metric Cards */
    [data-testid="stMetric"] {
        background: rgba(255,255,255,0.95);
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-left: 4px solid #006D5F;
    }
    
    [data-testid="stMetric"] label {
        color: #006D5F !important;
        font-weight: 700 !important;
    }
    
    [data-testid="stMetric"] .stMetric-value {
        color: #004D41 !important;
        font-size: 28px !important;
    }
    
    /* Headers */
    h1, h2, h3 {
        color: white !important;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background: rgba(255,255,255,0.15);
        border-radius: 10px;
        padding: 5px;
    }
    
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        padding: 8px 20px;
        color: white !important;
        font-weight: 600;
    }
    
    .stTabs [aria-selected="true"] {
        background: #00B4A0 !important;
        color: white !important;
    }
    
    /* Button */
    .stButton button {
        background: #00B4A0;
        color: white;
        border-radius: 25px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton button:hover {
        background: #008B7A;
        transform: scale(1.02);
    }
    
    /* Dataframe */
    .stDataFrame {
        background: rgba(255,255,255,0.95);
        border-radius: 15px;
        padding: 10px;
    }
    
    /* Footer */
    .footer {
        text-align: center;
        padding: 20px;
        color: rgba(255,255,255,0.7);
        font-size: 12px;
    }
</style>
""", unsafe_allow_html=True)

# ================================================================
# LOAD DATA
# ================================================================
@st.cache_data
def load_data():
    df = pd.read_csv('main_data.csv')
    if 'protein_per_100cal' not in df.columns:
        df['protein_per_100cal'] = (df['proteins'] / df['calories']) * 100
        df['protein_per_100cal'] = df['protein_per_100cal'].fillna(0)
    return df

try:
    df = load_data()
    st.success("✅ Data berhasil dimuat!")
except FileNotFoundError:
    st.error("❌ File 'main_data.csv' tidak ditemukan! Pastikan file ada di folder yang sama.")
    st.stop()

# ================================================================
# HEADER
# ================================================================
st.title("🥗 NutriFirst - Smart Menu Recommendation")
st.markdown("**Berdasarkan Analisis Gizi dan Harga Menu Makanan Indonesia**")
st.markdown("---")

# ================================================================
# SIDEBAR - SLICER FILTER
# ================================================================
with st.sidebar:
    st.image("https://img.icons8.com/color/96/000000/healthy-food.png", width=80)
    st.markdown("# 🧠 NutriFirst")
    st.markdown("### Filter Menu")
    st.markdown("---")
    
    # Filter Bahan Dasar
    st.markdown("**🍖 Bahan Dasar**")
    selected_bahan = st.multiselect(
        "Pilih bahan dasar:",
        options=df['bahan_dasar'].unique(),
        default=df['bahan_dasar'].unique(),
        label_visibility="collapsed"
    )
    
    # Filter Harga
    st.markdown("**💰 Rentang Harga**")
    min_price = int(df['harga'].min())
    max_price = int(df['harga'].max())
    price_range = st.slider(
        "Harga (Rp)",
        min_value=min_price,
        max_value=max_price,
        value=(min_price, max_price),
        step=5000,
        label_visibility="collapsed"
    )
    
    # Filter Kalori
    st.markdown("**🔥 Rentang Kalori**")
    min_cal = int(df['calories'].min())
    max_cal = int(df['calories'].max())
    cal_range = st.slider(
        "Kalori (kkal)",
        min_value=min_cal,
        max_value=max_cal,
        value=(min_cal, max_cal),
        step=50,
        label_visibility="collapsed"
    )
    
    # Filter Protein
    st.markdown("**💪 Rentang Protein**")
    min_prot = float(df['proteins'].min())
    max_prot = float(df['proteins'].max())
    prot_range = st.slider(
        "Protein (gram)",
        min_value=min_prot,
        max_value=max_prot,
        value=(min_prot, max_prot),
        step=5.0,
        label_visibility="collapsed"
    )
    
    st.markdown("---")
    st.caption("NutriFirst © 2024")

# ================================================================
# APPLY FILTERS
# ================================================================
filtered_df = df[
    (df['bahan_dasar'].isin(selected_bahan)) &
    (df['harga'] >= price_range[0]) &
    (df['harga'] <= price_range[1]) &
    (df['calories'] >= cal_range[0]) &
    (df['calories'] <= cal_range[1]) &
    (df['proteins'] >= prot_range[0]) &
    (df['proteins'] <= prot_range[1])
]

# ================================================================
# METRIK KPI
# ================================================================
st.markdown("## 📊 Ringkasan Data")
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("🍽️ Total Menu", f"{len(filtered_df)}")
with col2:
    st.metric("💰 Rata-rata Harga", f"Rp {filtered_df['harga'].mean():,.0f}")
with col3:
    st.metric("💪 Rata-rata Protein", f"{filtered_df['proteins'].mean():.1f} g")
with col4:
    st.metric("🔥 Rata-rata Kalori", f"{filtered_df['calories'].mean():.0f} kkal")
with col5:
    best_protein = filtered_df.loc[filtered_df['proteins'].idxmax(), 'name'] if len(filtered_df) > 0 else "-"
    st.metric("🏆 Protein Tertinggi", best_protein[:25] + "..." if len(best_protein) > 25 else best_protein)

st.markdown("---")

# ================================================================
# TAB UTAMA
# ================================================================
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "🍽️ Daftar Menu", 
    "📊 Analisis Harga", 
    "🥩 Analisis Gizi", 
    "💪 Rekomendasi",
    "📈 Korelasi"
])

# ================================================================
# TAB 1: DAFTAR MENU DENGAN PAGINATION
# ================================================================
with tab1:
    st.markdown("### 🍽️ Daftar Menu Makanan")
    
    # Pagination
    items_per_page = st.selectbox("Tampilkan per halaman:", [10, 25, 50, 100], index=0)
    total_pages = max(1, (len(filtered_df) + items_per_page - 1) // items_per_page)
    
    col_page, col_info = st.columns([2, 3])
    with col_page:
        page_number = st.number_input("Halaman", min_value=1, max_value=total_pages, value=1)
    with col_info:
        start_idx = (page_number - 1) * items_per_page
        end_idx = min(start_idx + items_per_page, len(filtered_df))
        st.info(f"Menampilkan {start_idx + 1} - {end_idx} dari {len(filtered_df)} menu")
    
    # Tabel data
    paginated_df = filtered_df.iloc[start_idx:end_idx]
    display_cols = ['id', 'name', 'bahan_dasar', 'calories', 'proteins', 'fat', 'carbohydrate', 'harga']
    
    st.dataframe(
        paginated_df[display_cols].style.format({
            'harga': 'Rp {:,.0f}',
            'calories': '{:.0f} kkal',
            'proteins': '{:.1f} g',
            'fat': '{:.1f} g',
            'carbohydrate': '{:.1f} g'
        }),
        use_container_width=True,
        height=400
    )
    
    # Export
    if st.button("📥 Export ke CSV", use_container_width=True):
        csv = filtered_df[display_cols].to_csv(index=False).encode('utf-8')
        st.download_button("Download CSV", csv, "nutrifirst_menu.csv", "text/csv")

# ================================================================
# TAB 2: ANALISIS HARGA
# ================================================================
with tab2:
    st.markdown("### 💰 Analisis Distribusi Harga")
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.boxplot(data=filtered_df, x='bahan_dasar', y='harga', palette='Set2', ax=ax)
        ax.set_title('Distribusi Harga per Bahan Dasar')
        ax.set_xlabel('Bahan Dasar')
        ax.set_ylabel('Harga (Rp)')
        ax.set_yscale('log')
        st.pyplot(fig)
    
    with col2:
        mean_price = filtered_df.groupby('bahan_dasar')['harga'].mean().sort_values()
        fig, ax = plt.subplots(figsize=(10, 6))
        bars = ax.bar(mean_price.index, mean_price.values, color=['#FF6B6B', '#4ECDC4', '#45B7D1'])
        ax.set_title('Rata-rata Harga per Bahan Dasar')
        ax.set_xlabel('Bahan Dasar')
        ax.set_ylabel('Rata-rata Harga (Rp)')
        for bar, val in zip(bars, mean_price.values):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 500, f'Rp {int(val):,}', ha='center', fontsize=10)
        st.pyplot(fig)
    
    # Statistik
    st.markdown("### 📋 Statistik Harga Lengkap")
    price_stats = filtered_df.groupby('bahan_dasar')['harga'].agg(['count', 'min', 'mean', 'median', 'max']).round(0)
    price_stats.columns = ['Jumlah', 'Min (Rp)', 'Rata-rata (Rp)', 'Median (Rp)', 'Max (Rp)']
    st.dataframe(price_stats, use_container_width=True)

# ================================================================
# TAB 3: ANALISIS GIZI
# ================================================================
with tab3:
    st.markdown("### 🥩 Analisis Kandungan Gizi")
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.scatterplot(data=filtered_df, x='proteins', y='fat', hue='bahan_dasar', alpha=0.7, s=80, ax=ax)
        ax.set_title('Hubungan Protein vs Lemak')
        ax.set_xlabel('Protein (gram)')
        ax.set_ylabel('Lemak (gram)')
        ax.legend(title='Bahan Dasar')
        st.pyplot(fig)
    
    with col2:
        corr_matrix = filtered_df[['calories', 'proteins', 'fat', 'carbohydrate', 'harga']].corr()
        fig, ax = plt.subplots(figsize=(8, 6))
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f', square=True, ax=ax)
        ax.set_title('Matriks Korelasi')
        st.pyplot(fig)
    
    # Top efisiensi protein
    st.markdown("### 🏆 Top 10 Menu Efisiensi Protein Tertinggi")
    st.markdown("*(Gram protein per 100 kalori)*")
    top_efficient = filtered_df.nlargest(10, 'protein_per_100cal')[['name', 'bahan_dasar', 'proteins', 'calories', 'protein_per_100cal', 'harga']]
    st.dataframe(top_efficient.style.format({'protein_per_100cal': '{:.2f}', 'harga': 'Rp {:,.0f}'}), use_container_width=True)

# ================================================================
# TAB 4: REKOMENDASI
# ================================================================
with tab4:
    st.markdown("### 🥗 Rekomendasi Menu")
    st.markdown("**Kriteria:** Protein > 20g, Lemak < 15g, Karbohidrat < 20g")
    
    ideal_stunting = filtered_df[(filtered_df['proteins'] > 20) & 
                             (filtered_df['fat'] < 15) & 
                             (filtered_df['carbohydrate'] < 20)]
    
    if len(ideal_stunting) > 0:
        st.success(f"✅ Ditemukan {len(ideal_stunting)} menu yang memenuhi kriteria!")
        
        top_stunting = ideal_stunting.nlargest(10, 'proteins')[['name', 'bahan_dasar', 'proteins', 'fat', 'carbohydrate', 'calories', 'harga']]
        st.dataframe(top_stunting.style.format({'harga': 'Rp {:,.0f}', 'calories': '{:.0f} kkal'}), use_container_width=True)
        
        # Visualisasi
        fig, ax = plt.subplots(figsize=(12, 6))
        stunting_melted = top_stunting.melt(id_vars=['name', 'bahan_dasar'], 
                                    value_vars=['proteins', 'fat', 'carbohydrate'],
                                    var_name='Nutrisi', value_name='Gram')
        sns.barplot(data=stunting_melted, x='name', y='Gram', hue='Nutrisi', palette='Set2', ax=ax)
        ax.set_title('Komposisi Gizi Menu Rekomendasi')
        ax.set_xlabel('Nama Menu')
        ax.set_ylabel('Gram')
        ax.tick_params(axis='x', rotation=45, labelsize=9)
        plt.tight_layout()
        st.pyplot(fig)
    else:
        st.warning("⚠️ Tidak ada menu yang memenuhi kriteria dengan filter saat ini.")

# ================================================================
# TAB 5: KORELASI HARGA VS PROTEIN
# ================================================================
with tab5:
    st.markdown("### 📈 Korelasi Harga vs Kandungan Protein")
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.scatterplot(data=filtered_df, x='harga', y='proteins', hue='bahan_dasar', alpha=0.6, s=60, ax=ax)
        ax.set_title('Hubungan Harga vs Protein')
        ax.set_xlabel('Harga (Rp)')
        ax.set_ylabel('Protein (gram)')
        ax.set_xscale('log')
        ax.legend(title='Bahan Dasar')
        st.pyplot(fig)
    
    with col2:
        correlations = []
        bahans = []
        for bahan in filtered_df['bahan_dasar'].unique():
            subset = filtered_df[filtered_df['bahan_dasar'] == bahan]
            if len(subset) > 1:
                corr = subset[['harga', 'proteins']].corr().iloc[0,1]
                correlations.append(corr)
                bahans.append(bahan)
        
        fig, ax = plt.subplots(figsize=(8, 5))
        colors_corr = ['#FF6B6B' if c < 0 else '#4ECDC4' for c in correlations]
        bars = ax.bar(bahans, correlations, color=colors_corr)
        ax.set_title('Korelasi Harga vs Protein per Bahan Dasar')
        ax.set_xlabel('Bahan Dasar')
        ax.set_ylabel('Koefisien Korelasi')
        ax.axhline(y=0, color='gray', linestyle='-', alpha=0.5)
        for bar, corr in zip(bars, correlations):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + (0.05 if corr > 0 else -0.1),
                    f'{corr:.3f}', ha='center', fontsize=10)
        st.pyplot(fig)
    
    # Insight
    corr_overall = filtered_df[['harga', 'proteins']].corr().iloc[0,1]
    st.markdown("---")
    st.markdown("### 💡 Insight Penting")
    
    if abs(corr_overall) < 0.3:
        st.info(f"📌 **Korelasi harga vs protein sangat lemah ({corr_overall:.3f})**\n\nArtinya: **Harga yang lebih mahal TIDAK menjamin kandungan protein yang lebih tinggi**. Rekomendasi: Pilih menu berdasarkan kebutuhan gizi, bukan berdasarkan harga.")
    else:
        st.info(f"📌 **Korelasi harga vs protein: {corr_overall:.3f}**")

# ================================================================
# FOOTER
# ================================================================
st.markdown("---")
st.markdown("""
<div class="footer">
    <p>NutriFirst - Rekomendasi Menu Berbasis Gizi & Budget | Data Gizi Makanan Indonesia</p>
    <p>Segmen ekonomi: A (&lt;Rp2jt), B (Rp2-5jt), C (&gt;Rp5jt) per bulan</p>
</div>
""", unsafe_allow_html=True)
