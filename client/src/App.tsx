import { useEffect, useState } from 'react';

// Mirroring the health check type from API
interface HealthCheckResponse {
  status: 'ok' | 'error';
  dbMessage: string;
  timestamp: string;
}

export function App() {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    
    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data: HealthCheckResponse) => setData(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error connecting to API: {error}</div>;
  if (!data) return <div>Connecting to backend...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Student Portal Prototype</h1>
      <p><strong>API Status:</strong> {data.status}</p>
      <p><strong>DB Connection:</strong> {data.dbMessage}</p>
      <p><strong>Server Time:</strong> {data.timestamp}</p>
    </div>
  );
}

export default App;
