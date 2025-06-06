import React, { useState } from 'react';
import './App.css';
import image from './moneyheist.webp';

// ResultDisplay component
function ResultDisplay({ result, error, amount, fromCurrency, toCurrency }) {
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (result !== null)
    return (
      <div style={{ fontSize: '1.2em', marginTop: '10px' }}>
        {amount} {fromCurrency} = {result} {toCurrency}
      </div>
    );
  return null;
}

// ConversionHistory component
function ConversionHistory({ history }) {
  if (!history.length) return null;
  return (
    <div style={{ marginTop: 30, textAlign: 'left', maxWidth: 400 }}>
      <h3 style={{ fontSize: '1em', marginBottom: 8 }}>Conversion History</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            {item.amount} {item.from} → {item.to}: {item.result}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Frankfurter API: https://www.frankfurter.app/docs/
      const response = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();
      if (data.rates && data.rates[toCurrency] !== undefined) {
        const res = data.rates[toCurrency].toFixed(2);
        setResult(res);
        setHistory(prev => [
          { amount, from: fromCurrency, to: toCurrency, result: res },
          ...prev.slice(0, 4)
        ]);
      } else {
        setError('Conversion failed.');
      }
    } catch (err) {
      setError('Error fetching rates.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Removed old logo and added a new image */}
        <img src={image} alt="hacker with mask" style={{ width: 500, height: 300, borderRadius: '50%', marginBottom: 20, filter: 'brightness(0.6)' }} />
        <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: 10, letterSpacing: '2px', userSelect: 'all' }}>AGNYATHAVASI</div>
        <h2 style={{ whiteSpace: 'nowrap', overflow: 'hidden', borderRight: '2px solid #b30000', width: 'fit-content', animation: 'typing 2.5s steps(20, end), blink-caret 0.75s step-end infinite' }}>Currency Converter</h2>
        <div style={{ margin: '20px' }}>
          <label htmlFor="amount" style={{ display: 'none' }}>Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0"
            style={{ width: '100px', marginRight: '10px' }}
            aria-label="Amount to convert"
          />
          <label htmlFor="from-currency" style={{ display: 'none' }}>From Currency</label>
          <select id="from-currency" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} aria-label="From currency">
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
          </select>
          <span style={{ margin: '0 10px' }}>to</span>
          <label htmlFor="to-currency" style={{ display: 'none' }}>To Currency</label>
          <select id="to-currency" value={toCurrency} onChange={e => setToCurrency(e.target.value)} aria-label="To currency">
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
          </select>
          <button onClick={handleConvert} style={{ marginLeft: '10px' }} disabled={loading} aria-label="Convert">
            {loading ? 'Converting...' : 'Convert'}
          </button>
        </div>
        <ResultDisplay result={result} error={error} amount={amount} fromCurrency={fromCurrency} toCurrency={toCurrency} />
        <ConversionHistory history={history} />
      </header>
    </div>
  );
}

export default App;
