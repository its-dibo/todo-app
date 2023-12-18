import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AddressInfo } from 'node:net';
import { ConfigService } from '@nestjs/config';

export const apiVersions = ['1.0'];

function bootstrap() {
  return NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  ).then((app) => {
    app.setGlobalPrefix('api', {
      exclude: ['sitemap.xml', 'robots.txt'],
    });
    app.enableVersioning({
      defaultVersion: apiVersions,
      type: VersioningType.URI,
    });
    // todo: whitelist domains
    app.enableCors();

    let swaggerConfig = new DocumentBuilder()
      .setTitle('todo')
      .setDescription('todo API documentations')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    let document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('', app, document);

    let configService = app.get(ConfigService),
      port = configService.get('PORT', 3000);
    return app.listen(port);
  });
}
bootstrap().then((app) => {
  let { address, port } = <AddressInfo>app.address();
  console.log(`running at ${address}:${port}`);
});
