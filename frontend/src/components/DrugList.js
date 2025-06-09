import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DrugList.css';

function DrugList() {
  const [generic, setGeneric] = useState([]);
  const [brand, setBrand] = useState([]);
  const [filteredGeneric, setFilteredGeneric] = useState([]);
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Initial fetch
  useEffect(() => {
    Promise.all([
      fetch('/api/drugs').then((res) => res.json()),
      fetch('/api/brands').then((res) => res.json()),
    ])
      .then(([gen, brand]) => {
        const sortedGen = [...gen].sort((a, b) => a.localeCompare(b));
        const sortedBrand = [...brand].sort((a, b) => a.localeCompare(b));
        setGeneric(sortedGen);
        setBrand(sortedBrand);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  useEffect(() => {
    if (!generic.length && !brand.length) return;

    const filterList = (list) => {
      return list.filter((name) => {
        if (!/^[A-Za-z.(]/.test(name)) return false;
        if (/[^A-Za-z\s().-]/.test(name)) return false;

        if (query.trim()) {
          return name.toLowerCase().includes(query.toLowerCase());
        }

        if (selectedLetter === 'All') return true;
        return name.toLowerCase().startsWith(selectedLetter.toLowerCase());
      });
    };

    setFilteredGeneric(filterList(generic));
    setFilteredBrand(filterList(brand));
  }, [query, selectedLetter, generic, brand]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setQuery('');
  };

  const handleSearchClick = () => {
    const search = query.trim().toLowerCase();
    const allDrugs = [...generic, ...brand].map((d) => d.toLowerCase());

    if (search && allDrugs.includes(search)) {
      navigate(`/drug/${encodeURIComponent(query.trim())}`);
    } else {
      alert('No exact match found.');
    }
  };

  const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

  if (loading) {
    return <div className="text-center mt-5">Loading drug list...</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">DRUG INFORMATION PROJECT</h1>

      {/* Search bar with icon */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-3 d-flex" role="search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search drug name..."
          className="form-control me-2"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSearchClick}
          title="Search"
        >
          🔍
        </button>
      </form>

      {/* Alphabet filter */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`btn btn-sm letter-btn ${
              selectedLetter === letter ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
        <button
          className={`btn btn-sm letter-btn ${
            selectedLetter === 'All' ? 'btn-primary' : 'btn-outline-secondary'
          }`}
          onClick={() => handleLetterClick('All')}
        >
          All
        </button>
      </div>

      {/* Brand & Generic lists */}
      <div className="row">
        <div className="col-md-6 text-start">
          <h5 className="text-center">BRANDED DRUG NAMES</h5>
          <ul className="list-group">
            {filteredBrand.map((drug, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action text-success drug-item"
                onClick={() => navigate(`/drug/${encodeURIComponent(drug)}`)}
              >
                {drug.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6 text-start">
          <h5 className="text-center">GENERIC DRUG NAMES</h5>
          <ul className="list-group">
            {filteredGeneric.map((drug, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action text-primary drug-item"
                onClick={() => navigate(`/drug/${encodeURIComponent(drug)}`)}
              >
                {drug}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DrugList;
