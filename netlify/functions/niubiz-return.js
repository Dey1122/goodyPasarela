// netlify/functions/niubiz-return.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      // simple texto para verificar por GET
      return { statusCode: 200, body: 'niubiz-return OK (use POST from Niubiz)' };
    }

    // Niubiz manda x-www-form-urlencoded
    const params = new URLSearchParams(event.body || '');
    const token   = params.get('transactionToken') || params.get('token') || '';
    const email   = params.get('customerEmail') || '';
    const channel = params.get('channel') || 'web';

    const qs = new URLSearchParams({
      transactionToken: token || '',
      customerEmail: email || '',
      channel,
      ok: token ? '1' : '0'
    }).toString();

    return {
      statusCode: 302,
      headers: { Location: `/success.html?${qs}` },
      body: ''
    };
  } catch (e) {
    return { statusCode: 500, body: `error: ${e.message || e}` };
  }
};
