import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { combineLatest } from 'rxjs';



@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //get-다가져오기
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  //
  @Get(':id')
  getPost(@Param('id') id : string) {
    return this.postsService.getPostById(+id);
  }

  @Post()
  createPost(
    @Body('auth') auth : string,
    @Body('title') title : string,
    @Body('content') content : string
  ) {
    return this.postsService.createPost(auth, title, content);
  }

  @Put(':id')
  updatePost(
    @Param('id') id : string,
    @Body('title') title? : string,
    @Body('content') content? : string
  ) {
    return this.postsService.updatePost(+id, title, content); 
  }

  @Delete(":id")
  deletePost(
    @Param('id') id : string
  ) {
    return this.postsService.deletePost(+id);
  }

}
