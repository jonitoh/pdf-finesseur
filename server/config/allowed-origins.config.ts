const allowedOrigins: string[] = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['*'];

export default allowedOrigins;
