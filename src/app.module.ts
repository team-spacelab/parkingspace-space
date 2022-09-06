import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CryptoModule, DBConfigService, HealthModule, LoggerModule, ResolveTokenMiddleware } from 'parkingspace-commons'
import { SpaceModule } from './spaces/spaces.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DBConfigService
    }),
    LoggerModule,
    CryptoModule,
    HealthModule,
    SpaceModule
  ]
})
export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(ResolveTokenMiddleware)
      .forRoutes('/')
  }
}
