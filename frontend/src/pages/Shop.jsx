import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    API.get('/products/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCat) params.set('category', selectedCat);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    API.get(`/products?${params.toString()}`)
      .then(res => {
        let data = res.data;
        if (sort === 'price_asc') data.sort((a, b) => a.price - b.price);
        else if (sort === 'price_desc') data.sort((a, b) => b.price - a.price);
        else if (sort === 'name') data.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(data);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, selectedCat, sort, minPrice, maxPrice]);

  const handleCatSelect = (cat) => {
    setSelectedCat(cat);
    setSearchParams(cat ? { category: cat } : {});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCat('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setSearchParams({});
  };

  // Pagination
  const totalPages = Math.ceil(products.length / PER_PAGE);
  const paged = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1><i className="fas fa-store me-2"></i>Our Products</h1>
          <p>Browse {products.length} fresh products across all categories</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {/* ======= SIDEBAR FILTERS ======= */}
          <div className="col-lg-3">
            <div className="card-custom p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 style={{ fontWeight: 700, margin: 0 }}><i className="fas fa-filter me-2 text-muted"></i>Filters</h6>
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="form-label-custom">Search</label>
                <form onSubmit={handleSearchSubmit} className="search-bar">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ paddingLeft: '44px' }}
                  />
                </form>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="form-label-custom">Category</label>
                <div className="d-flex flex-column gap-1">
                  <button
                    onClick={() => handleCatSelect('')}
                    className={`category-pill ${selectedCat === '' ? 'active' : ''}`}
                    style={{ borderRadius: '8px', justifyContent: 'flex-start' }}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCatSelect(cat)}
                      className={`category-pill ${selectedCat === cat ? 'active' : ''}`}
                      style={{ borderRadius: '8px', justifyContent: 'flex-start' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-3">
                <label className="form-label-custom">Price Range (₹)</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control-custom"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    className="form-control-custom"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======= PRODUCTS GRID ======= */}
          <div className="col-lg-9">
            {/* Top Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>
                Showing <strong>{paged.length}</strong> of <strong>{products.length}</strong> products
                {selectedCat && <> in <strong style={{ color: 'var(--primary)' }}>{selectedCat}</strong></>}
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="form-control-custom"
                style={{ width: 'auto', minWidth: '180px' }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="row g-4">
                {[...Array(8)].map((_, i) => (
                  <div className="col-6 col-md-4" key={i}>
                    <div className="product-card">
                      <div className="skeleton" style={{ height: '190px' }}></div>
                      <div className="card-body">
                        <div className="skeleton mb-2" style={{ height: '18px', width: '60%' }}></div>
                        <div className="skeleton mb-2" style={{ height: '14px' }}></div>
                        <div className="skeleton" style={{ height: '36px' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h4>No products found</h4>
                <p>Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-primary-custom mt-3">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {paged.map((product, i) => (
                    <div className="col-6 col-md-4" key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center gap-2 mt-5">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-outline-custom"
                      style={{ padding: '9px 20px' }}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? 'btn-primary-custom' : 'btn-outline-custom'}
                        style={{ padding: '9px 16px', minWidth: '44px' }}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn-outline-custom"
                      style={{ padding: '9px 20px' }}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
