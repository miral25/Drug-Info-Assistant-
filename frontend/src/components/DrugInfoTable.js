import React from 'react';
import fieldLabels from '../data/fieldLabels';
import openfdaSubfieldLabels from '../data/openfdaSubfieldLabels';
import '../styles/DrugInfoTable.css';

// Clean and sanitize FDA HTML
const sanitizeFDAHtml = (rawHtml) => {
  if (!rawHtml) return '';

  let cleaned = rawHtml
    .replace(/<list[^>]*>/gi, '<ul>')
    .replace(/<\/list>/gi, '</ul>')
    .replace(/<item[^>]*>/gi, '<li>')
    .replace(/<\/item>/gi, '</li>')
    .replace(/<caption[^>]*>/gi, '')
    .replace(/<\/caption>/gi, '')
    .replace(/<paragraph[^>]*>/gi, '<p>')
    .replace(/<\/paragraph>/gi, '</p>');

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleaned, 'text/html');

  // Clean bullet points in <li>
  doc.querySelectorAll('li').forEach(li => {
    let text = li.textContent || '';
    text = text.replace(/^•\s*/g, '').trim();
    if (text) {
      li.textContent = text.charAt(0).toUpperCase() + text.slice(1);
    }
  });

  // Handle bullets embedded in <td> content
  doc.querySelectorAll('td').forEach(td => {
    const raw = td.innerHTML;

    if (raw.includes('•')) {
      const parts = raw
        .split(/•+/g)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (parts.length > 0) {
        const list = parts
          .map(item => {
            const capitalized = item.charAt(0).toUpperCase() + item.slice(1);
            return `<li>${capitalized}</li>`;
          })
          .join('');
        td.innerHTML = `<ul>${list}</ul>`;
      }
    } else {
      const text = td.textContent.trim();
      if (text) {
        td.textContent = text.charAt(0).toUpperCase() + text.slice(1);
      }
    }
  });

  return doc.body.innerHTML;
};

// Render individual field values
const renderValue = (value, key) => {
  if (!value) return null;

  // openfda sub-table
  if (key === 'openfda' && typeof value === 'object' && !Array.isArray(value)) {
    return (
      <table className="table table-hover table-sm table-bordered mt-2 sub-table">
        <tbody>
          {Object.entries(value).map(([subKey, subVal]) => {
            const label = openfdaSubfieldLabels[subKey] || subKey;
            return (
              <tr key={subKey}>
                <td className="fw-bold">{label}</td>
                <td>
                  {Array.isArray(subVal)
                    ? subVal.join(', ')
                    : typeof subVal === 'object'
                    ? JSON.stringify(subVal, null, 2)
                    : subVal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  // FDA HTML content fields
  if (
    key.endsWith('_table') &&
    Array.isArray(value) &&
    typeof value[0] === 'string' &&
    value[0].includes('<')
  ) {
    const cleanedHtml = sanitizeFDAHtml(value[0]);
    return (
      <div
        className="fda-html-content"
        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
      />
    );
  }

  // Array of values
  if (Array.isArray(value)) {
    return (
      <div className="value-array">
        {value.map((item, idx) => (
          <div key={idx} className="value-item">
            {typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
          </div>
        ))}
      </div>
    );
  }

  // Raw object
  if (typeof value === 'object') {
    return <pre className="value-object">{JSON.stringify(value, null, 2)}</pre>;
  }

  // Simple string/number
  return <div className="value-text">{value}</div>;
};

// Main component
const DrugInfoTable = ({ data }) => {
  if (!data || typeof data !== 'object') return null;

  return (
    <>
      <table className="table table-striped table-hover table-bordered drug-info-table">
        <thead className="table-light">
          <tr>
            <th className="label-cell">Field Name</th>
            <th className="value-cell">Information</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => {
            if (!value) return null;
            const label = fieldLabels[key] || key;
            return (
              <tr key={key}>
                <td className="fw-bold label-cell">{label}</td>
                <td className="value-cell">{renderValue(value, key)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Scroll Buttons */}
      <button
        className="scroll-to-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>

      <button
        className="scroll-to-bottom-btn"
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
      >
        ↓
      </button>
    </>
  );
};

export default DrugInfoTable;
