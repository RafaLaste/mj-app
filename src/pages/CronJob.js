import React, { useEffect, useState } from 'react';

function CronJob() {
  const [message, setMessage] = useState('');
  const baseUrl = process.env.REACT_APP_API_URL;

  const fetchValidar = async () => {
    try {
      const response = await fetch(`${baseUrl}/validar`, {
        method: 'GET',
      });

      const data = await response.json();
      console.log(data)
      setMessage(data.result);

    } catch (error) {
      setMessage('Não foi possível atualizar os dados. Tente novamente mais tarde.');
    }
  };
  
  useEffect(() => {
    fetchValidar();
  }, []);

  return (
    <>
     {message}
    </>
  )
}

export default CronJob;