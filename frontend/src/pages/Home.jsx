import { useState, useEffect, useCallback } from 'react';
import { getAllProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { Loader2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BANNERS = [
  { bg: 'linear-gradient(120deg,#0f4c35 55%,#1a7a4a)', title: 'Farm Fresh Vegetables', sub: 'Straight from the farm to your door', pill: '10 min delivery', img: '/images/vegetables.avif' },
  { bg: 'linear-gradient(120deg,#7c2d12 55%,#c2410c)', title: 'Juicy Fresh Fruits', sub: 'Handpicked seasonal fruits daily', pill: '100% Fresh', img: '/images/fruits.png' },
  { bg: 'linear-gradient(120deg,#1e3a5f 55%,#2563eb)', title: 'Dairy & Everyday Essentials', sub: 'Fresh milk, curd, paneer & more', pill: 'Fresh every morning', img: '/images/diary.jpg' },
  { bg: 'linear-gradient(120deg,#4a1d96 55%,#7c3aed)', title: 'Snacks & Munchies', sub: 'Your favourite snacks, delivered fast', pill: 'Party ready', img: '/images/snacks.jpeg' },
  { bg: 'linear-gradient(120deg,#065f46 55%,#059669)', title: 'Food Grains & Staples', sub: 'Rice, dal, atta & all kitchen basics', pill: 'Best quality', img: '/images/food-grains.jpg' },
  { bg: 'linear-gradient(120deg,#0c4a6e 55%,#0284c7)', title: 'Drinks & Beverages', sub: 'Juices, sodas, water & more', pill: 'Stay refreshed', img: '/images/drinks.jpg' },
];

const ALL_CATS = ['vegetables', 'fruits', 'diary', 'food-grains', 'drinks', 'snacks'];

// Bar 1 category tabs (filter within home page)
const BAR1_TABS = [
  { label: 'All', value: '' },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Fruits', value: 'fruits' },
  { label: 'Dairy', value: 'diary' },
  { label: 'Food Grains', value: 'food-grains' },
  { label: 'Drinks', value: 'drinks' },
  { label: 'Snacks', value: 'snacks' },
];

// Bars 2-5 definitions — no see all
const COMBO_BARS = [
  { label: 'Vegetables & Fruits', cats: ['vegetables', 'fruits'] },
  { label: 'Dairy & Food Grains', cats: ['diary', 'food-grains'] },
  { label: 'Snacks & Drinks', cats: ['snacks', 'drinks'] },
];

const PAGE_SIZE = 10; // 2 rows × 5 cols
const CAT_PAGE_SIZE = 10; // max 2 rows for specific category in bar1

// Horizontal scroll row — no see all button
function ScrollRow({ title, products, onCartUpdate }) {
  if (!products.length) return null;
  return (
    <div className="cat-row">
      <div className="cat-row-header">
        <h3>{title}</h3>
        <span className="cat-row-count">{Math.min(products.length, 10)} items</span>
      </div>
      <div className="cat-row-scroll">
        {products.slice(0, 10).map((p) => (
          <div className="cat-row-item" key={p._id}>
            <ProductCard product={p} onCartUpdate={onCartUpdate} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Paginated grid for "All" tab in bar 1
function PaginatedGrid({ products, onCartUpdate }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const slice = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [products.length]);

  return (
    <>
      <div className="products-grid">
        {slice.map((p) => <ProductCard key={p._id} product={p} onCartUpdate={onCartUpdate} />)}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} className={`page-btn ${n === page ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </>
  );
}

// 2-row grid (max 10) + See All button for specific category
function CategoryPreviewGrid({ category, products, onCartUpdate }) {
  const navigate = useNavigate();
  const slice = products.slice(0, CAT_PAGE_SIZE);
  return (
    <>
      <div className="products-grid">
        {slice.map((p) => <ProductCard key={p._id} product={p} onCartUpdate={onCartUpdate} />)}
      </div>
      {products.length > 0 && (
        <div className="cat-preview-footer">
          <span className="cat-preview-count">Showing {slice.length} of {products.length}</span>
          <button className="see-all-btn" onClick={() => navigate(`/category/${category}`)}>
            See All {products.length} products <ArrowRight size={14} />
          </button>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bar1Tab, setBar1Tab] = useState('');
  const [banner, setBanner] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data.products || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    const t = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cur = BANNERS[banner];

  const bar1Products = bar1Tab
    ? products.filter(p => p.category === bar1Tab)
    : products.filter(p => ALL_CATS.includes(p.category));

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner" style={{ background: cur.bg }}>
        <div className="hero-text">
          <h1>{cur.title}</h1>
          <p>{cur.sub}</p>
          <span className="delivery-pill">{cur.pill}</span>
        </div>
        <div className="hero-img-wrap">
          <img src={cur.img} alt={cur.title} className="hero-img" />
        </div>
        <button className="banner-arrow left" onClick={() => setBanner(b => (b - 1 + BANNERS.length) % BANNERS.length)}>
          <ChevronLeft size={20} />
        </button>
        <button className="banner-arrow right" onClick={() => setBanner(b => (b + 1) % BANNERS.length)}>
          <ChevronRight size={20} />
        </button>
        <div className="banner-dots">
          {BANNERS.map((_, i) => <span key={i} className={`dot ${i === banner ? 'active' : ''}`} onClick={() => setBanner(i)} />)}
        </div>
      </div>

      {loading ? (
        <div className="loader-center"><Loader2 className="spin" size={36} /></div>
      ) : (
        <>
          {/* ── BAR 1 ── */}
          <div className="bar-section">
            {/* Tab strip for bar 1 */}
            <div className="bar1-tabs">
              {BAR1_TABS.map(t => (
                <button
                  key={t.value}
                  className={`bar1-tab ${bar1Tab === t.value ? 'active' : ''}`}
                  onClick={() => setBar1Tab(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="section-header" style={{ marginTop: 16 }}>
              <h2>{bar1Tab ? BAR1_TABS.find(t => t.value === bar1Tab)?.label : 'All Products'}</h2>
              <span className="product-count">{bar1Products.length} items</span>
            </div>

            {bar1Products.length === 0
              ? <div className="empty-state" style={{ minHeight: 120 }}><p>No products found</p></div>
              : bar1Tab === ''
                ? <PaginatedGrid products={bar1Products} onCartUpdate={fetchProducts} />
                : <CategoryPreviewGrid category={bar1Tab} products={bar1Products} onCartUpdate={fetchProducts} />
            }
          </div>

          {/* ── BARS 2-5: combo scroll rows, no see all ── */}
          <div className="category-rows">
            {COMBO_BARS.map(bar => (
              <ScrollRow
                key={bar.label}
                title={bar.label}
                products={products.filter(p => bar.cats.includes(p.category))}
                onCartUpdate={fetchProducts}
              />
            ))}
            {/* Bar 5: future/unknown categories */}
            {products.filter(p => !ALL_CATS.includes(p.category)).length > 0 && (
              <ScrollRow
                title="More Categories"
                products={products.filter(p => !ALL_CATS.includes(p.category))}
                onCartUpdate={fetchProducts}
              />
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
