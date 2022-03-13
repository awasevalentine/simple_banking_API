import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  const options = new DocumentBuilder()
    .setTitle('Simple Banking System')
    .addServer('localhost:3000/')
    .setDescription(`
    Note: That most of the Endpoints are using Gaurds(are been protected), so be sure to use Postman for testing \n
          and use the generated token received when logging in, as the authentication header, else you will be denied access.
          
    Click on any of the EndPoint you wish to use to see the kind of data its expecting to receive.\n
    You can also go the Schema section to see examples of it as well.
`)
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on Port', process.env.PORT || 3000);
  });
}
bootstrap();

