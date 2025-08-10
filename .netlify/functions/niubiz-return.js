exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const params = new URLSearchParams(event.body || '');
  const token = params.get('transactionToken') || '';
  const email = params.get('customerEmail') || '';
  const channel = params.get('channel') || 'web';

  const location = `/success.html?transactionToken=${encodeURIComponent(token)}&customerEmail=${encodeURIComponent(email)}&channel=${encodeURIComponent(channel)}`;

  return {
    statusCode: 303,
    headers: { Location: location },
    body: ''
  };
};
