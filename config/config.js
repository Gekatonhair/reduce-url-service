const config = {
    db: {
        postgres: {
            host: 'localhost', // server name or IP address;
            port: 5432,
            database: 'postgres',
            user: 'admin',
            password: 'admin'
        }
    },
    server: {
        port: 8080,
        host: 'localhost'
    },
    session: {
        secret: '0558',
        key: 'sid',
        cookie: {
            secure: true,
            path: '/',
            httpOnly: false,
            maxAge: 1800000
        }
    }
};

module.exports = config;
