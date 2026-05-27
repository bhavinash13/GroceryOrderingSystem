import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, Loader2, Search } from 'lucide-react';

const PAGE_SIZE = 20;

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(res => setAllProducts(res.data.products || []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [query]);

  const filtered = allProducts.filter(p => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="sr-page">
      <div className="sr-meta">
        {!loading && (
          <>
            <h2>{query ? <>Results for <span>"{query}"</span></> : 'All Products'}</h2>
            <span className="product-count">{filtered.length} items found</span>
          </>
        )}
      </div>

      {loading ? (
        <div className="loader-center"><Loader2 className="spin" size={36} /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-cart-icon">
            <Search size={40} color="#9ca3af" />
          </div>
          <p>No results for "{query}"</p>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>Try searching by product name, brand or category</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {paginated.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={`page-btn ${n === page ? 'active' : ''}`}
                  onClick={() => { setPage(n); window.scrollTo(0, 0); }}>{n}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronLeft size={15} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
