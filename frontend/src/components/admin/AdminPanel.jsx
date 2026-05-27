import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, Plus, X, Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['vegetables', 'fruits', 'diary', 'food-grains', 'drinks', 'snacks'];
const UNITS = ['kg', 'g', 'pieces', 'l', 'ml'];
const EMPTY_FORM = { name: '', description: '', price: '', category: '', unit: '', brand: '', discountPrice: '', stock: '' };

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      navigate('/');
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setImage(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, unit: p.unit, brand: p.brand, discountPrice: p.discountPrice, stock: p.stock });
    setEditId(p._id);
    setImage(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateProduct(editId, form);
        toast.success('Product updated!');
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (image) fd.append('image', image);
        await createProduct(fd);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2><Package size={24} /> Admin Panel</h2>
        <button className="add-product-btn" onClick={openCreate}><Plus size={18} /> Add Product</button>
      </div>

      {loading ? (
        <div className="loader-center"><Loader2 className="spin" size={36} /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image || 'https://placehold.co/50x50?text=?'} alt={p.name} className="admin-thumb" /></td>
                  <td><strong>{p.name}</strong><br /><small>{p.brand}</small></td>
                  <td><span className="cat-pill">{p.category}</span></td>
                  <td>₹{p.discountPrice > 0 ? p.discountPrice : p.price}{p.discountPrice > 0 && <s style={{ color: '#999', marginLeft: 4 }}>₹{p.price}</s>}</td>
                  <td><span className={p.stock === 0 ? 'stock-out' : 'stock-in'}>{p.stock}</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => openEdit(p)}><Edit2 size={16} /></button>
                    <button className="del-btn" onClick={() => handleDelete(p._id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required>
                    <option value="">Select</option>
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min={0} />
                </div>
                <div className="form-group">
                  <label>Discount Price (₹)</label>
                  <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} min={0} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required min={0} />
                </div>
              </div>
              {!editId && (
                <div className="form-group">
                  <label>Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>
              )}
              <button type="submit" className="auth-btn" disabled={saving}>
                {saving ? <Loader2 className="spin" size={18} /> : editId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
