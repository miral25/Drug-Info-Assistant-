import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DrugInfoTable from './DrugInfoTable';
import '../styles/DrugDetails.css';
import ChatBotWidget from './ChatBotWidget';

function DrugDetails() {
  const { name } = useParams();
  const [drug, setDrug] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/drug/${name}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setDrug(data);
        }
      })
      .catch(() => setError('Failed to fetch drug info.'));
  }, [name]);

  return (
    <div>
      <h2>{decodeURIComponent(name)}</h2>

      {error && <p className="text-danger mt-3">{error}</p>}

      {/* Bootstrap table will be rendered inside this */}
      {drug && (
        <div className="table-responsive">
          <DrugInfoTable data={drug} />
        </div>
      )}

      <div>
        <Link to="/" className="text-primary text-decoration-none">
          &larr; Back to List
        </Link>
      </div>
      <ChatBotWidget />
    </div>
  );
}

export default DrugDetails;
