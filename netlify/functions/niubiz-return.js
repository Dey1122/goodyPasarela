// netlify/functions/niubiz-return.js
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: cors(),
    };
  }

  const isPost = event.httpMethod === 'POST';
  const body = isPost ? event.body || '' : '';

  // Niubiz suele postear un form. No lo mostramos, solo devolvemos una página limpia
  // que reenvía el token a Flutter si viene en query o en body.
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html', ...cors() },
    body: `
<!doctype html><meta charset="utf-8">
<title>Niubiz Return</title>
<script>
  (function(){
    try {
      var params = new URLSearchParams(location.search);
      var token = params.get('transactionToken') || '';
      // Si el body llegó como form-urlencoded, intenta leerlo:
      var raw = ${JSON.stringify(body)} || '';
      if (!token && raw && raw.indexOf('transactionToken=')>-1){
        var m = raw.match(/transactionToken=([^&]+)/);
        if (m) token = decodeURIComponent(m[1]);
      }
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(JSON.stringify({type:'success', transactionToken: token}), '*');
      }
      document.body.innerHTML = token ? 'OK' : 'Sin token';
    } catch(e){
      document.body.innerHTML = 'Error';
    }
  })();
</script>`,
  };
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
