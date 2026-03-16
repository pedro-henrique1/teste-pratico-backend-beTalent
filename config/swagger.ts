// config/swagger.ts

export default {
  path: process.cwd(),
  title: 'API BeTalent',
  version: '1.0.0',
  description: 'API de testes da BeTalent',
  tagIndex: 2,
  info: {
    title: 'API BeTalent',
    version: '1.0.0',
    description: 'API de testes da BeTalent',
  },
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs', '/'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
