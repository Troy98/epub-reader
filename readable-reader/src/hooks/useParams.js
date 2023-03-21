import { useState, useEffect } from 'react';

const useParams = () => {
  const [params, setParams] = useState({});

  useEffect(() => {
    const updateParams = () => {
      const newParams = new URLSearchParams(window.location.search);
      setParams(newParams);
    };
    window.addEventListener('popstate', updateParams);
    updateParams();
    return () => window.removeEventListener('popstate', updateParams);
  }, []);

  return params;
};

export default useParams;
