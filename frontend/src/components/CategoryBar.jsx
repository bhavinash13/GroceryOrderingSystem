const categories = [
  { label: 'All', value: '', img: null, emoji: null },
  { label: 'Vegetables', value: 'vegetables', img: '/images/vegetables.avif' },
  { label: 'Fruits', value: 'fruits', img: '/images/fruits.png' },
  { label: 'Dairy', value: 'diary', img: '/images/diary.jpg' },
  { label: 'Food Grains', value: 'food-grains', img: '/images/food-grains.jpg' },
  { label: 'Drinks', value: 'drinks', img: '/images/drinks.jpg' },
  { label: 'Snacks', value: 'snacks', img: '/images/snacks.jpeg' },
];

export default function CategoryBar({ selected, onSelect }) {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat.value}
          className={`cat-btn ${selected === cat.value ? 'active' : ''}`}
          onClick={() => onSelect(cat.value)}
        >
          {cat.img ? (
            <img src={cat.img} alt={cat.label} className="cat-img" />
          ) : (
            <svg className="cat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
