import api from './api';

export const keepAlive = async () => {
  try {
    const response = await api.get('/keep-alive');
    console.log('Keep-alive executado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro no keep-alive:', error.message);
    return null;
  }
};

export const startKeepAlive = (intervalMinutes = 30) => {
  const intervalMs = intervalMinutes * 60 * 1000;
  keepAlive();
  const intervalId = setInterval(keepAlive, intervalMs);
  console.log(`Keep-alive iniciado! Ping a cada ${intervalMinutes} minutos`);
  return intervalId;
};

export const stopKeepAlive = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('Keep-alive parado!');
  }
};