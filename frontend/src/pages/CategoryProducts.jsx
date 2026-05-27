import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, Loader2 } from 'lucide-react';

const PAGE_SIZE = 10;

const CAT_LABELS = {
  vegetables: 'Vegetables', fruits: 'Fruits', diary: 'Dairy',
  'food-grains': 'Food Grains', drinks: 'Drinks', snacks: 'Snacks',
};
const CAT_IMGS = {
  vegetables: '/images/vegetables.avif', fruits: '/images/fruits.png',
  diary: '/images/diary.jpg', 'food-grains': '/images/food-grains.jpg',
  drinks: '/images/drinks.jpg', snacks: '/images/snacks.jpeg',
};

export default function CategoryProducts() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [visible, setVisible] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setVisible([]);
    getAllProducts()
      .then(res => {
        const filtered = (res.data.products || []).filter(p => p.category === category);
        setAllProducts(filtered);
        setVisible(filtered.slice(0, PAGE_SIZE));
        setPage(1);
      })
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const nextSlice = allProducts.slice(0, nextPage * PAGE_SIZE);
    if (nextSlice.length === visible.length) return; // nothing more
    setLoadingMore(true);
    setTimeout(() => {
      setVisible(nextSlice);
      setPage(nextPage);
      setLoadingMore(false);
    }, 400);
  }, [page, allProducts, visible.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const hasMore = visible.length < allProducts.length;

  return (
    <div className="cp-page">
      {/* Header with category image */}
      <div className="cp-header" style={{ backgroundImage: `url(${CAT_IMGS[category] || ''})` }}>
        <div className="cp-header-overlay">
          <button className="pd-back" onClick={() => navigate('/')} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
            <ChevronLeft size={18} /> Back
          </button>
          <h1>{CAT_LABELS[category] || category}</h1>
          <p>{allProducts.length} products available</p>
        </div>
      </div>

      {loading ? (
        <div className="loader-center"><Loader2 className="spin" size={36} /></div>
      ) : allProducts.length === 0 ? (
        <div className="empty-state"><p>No products in this category yet</p></div>
      ) : (
        <>
          <div className="cp-grid">
            {visible.map(p => <ProductCard key={p._id} product={p} />)}
          </div>

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="cp-sentinel">
            {loadingMore && <Loader2 className="spin" size={28} color="#0c831f" />}
            {!hasMore && visible.length > 0 && (
              <p className="cp-end">You've seen all {allProducts.length} products</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
