const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
    projectId: process.env.GC_PROJECT_ID,
    credentials: {
        type: process.env.GC_TYPE,
        project_id: process.env.GC_PROJECT_ID,
        private_key_id: process.env.GC_PRIVATE_KEY_ID,
        private_key: process.env.GC_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GC_CLIENT_EMAIL,
        client_id: process.env.GC_CLIENT_ID,
        auth_uri: process.env.GC_AUTH_URI,
        token_uri: process.env.GC_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GC_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GC_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GC_UNIVERSE_DOMAIN,
    },
});

module.exports = storage;
