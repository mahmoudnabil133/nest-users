import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password:'3mod4od123321',
      database: 'Users',
      entities: [User],
      synchronize: true
      
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
