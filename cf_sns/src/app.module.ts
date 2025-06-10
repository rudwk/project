import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "postgres",
      entities: [/*나중에 db에 연결될 모듈이 들어갈거임*/],
      synchronize: true,//개발환경에서는 true가 편하지만 프러덕션 확인할때는 db가 변경될 수 있기 때문에 false로 해놓아야한다
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
