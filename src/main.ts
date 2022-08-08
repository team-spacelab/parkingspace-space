import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupCommons } from 'parkingspace-commons'

async function bootstrap () {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })

  setupCommons(app, 'space')

  await app.listen(3000)
}

bootstrap()
