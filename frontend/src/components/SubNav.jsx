import { useNavigate, useLocation } from 'react-router-dom';

const NAV_CATS = [
  { label: 'All', value: '', img: null },
  { label: 'Vegetables', value: 'vegetables', img: '/images/vegetables.avif' },
  { label: 'Fruits', value: 'fruits', img: '/images/fruits.png' },
  { label: 'Dairy', value: 'diary', img: '/images/diary.jpg' },
  { label: 'Food Grains', value: 'food-grains', img: '/images/food-grains.jpg' },
  { label: 'Drinks', value: 'drinks', img: '/images/drinks.jpg' },
  { label: 'Snacks', value: 'snacks', img: '/images/snacks.jpeg' },
];

export default function SubNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname === '/'
    ? ''
    : location.pathname.startsWith('/category/')
      ? location.pathname.split('/category/')[1]
      : null;

  const handleClick = (value) => {
    if (value === '') navigate('/');
    else navigate(`/category/${value}`);
  };

  return (
    <div className="sub-nav">
      {NAV_CATS.map((cat) => (
        <button
          key={cat.value}
          className={`sub-nav-btn ${active === cat.value ? 'active' : ''}`}
          onClick={() => handleClick(cat.value)}
        >
          {cat.img ? (
            <img src={cat.img} alt={cat.label} className="sub-nav-img" />
          ) : (
            <svg className="sub-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          )}
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
