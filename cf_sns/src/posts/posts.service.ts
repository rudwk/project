import { Injectable, NotFoundException } from '@nestjs/common';

export interface post {
  id : number;
  auth : string;
  title : string;
  content : string;
  commentCount : number;
}

let posts : post[] = [
  {
    id : 1,
    auth : 'QWER',
    title : "qwer",
    content : "qwer",
    commentCount : 0
  },
  {
    id : 2,
    auth : "ASDF",
    title : "asdf",
    content : "asdf",
    commentCount : 1
  },
  {
    id: 3,
    auth : "ZXCV",
    title : "zxcv",
    content : "zxcv",
    commentCount : 2
  }
]

@Injectable()
export class PostsService {
  getAllPosts(){
    return posts;
  }

  getPostById(id : number){
    const ps = posts.find((post) => post.id == id);
    if(!ps){
      throw new NotFoundException();
    }

    return ps;
  }

  createPost(auth : string, title:string, content:string){
    const post = {
      id : posts[posts.length - 1].id + 1,//autoincrement
      auth,
      title,
      content,
      commentCount : 0
    };

    posts = [
      ...posts,
      post
    ];

    return post;
  }

  updatePost(id?:number, title?:string, content?:string){
    const post = posts.find(post => post.id == id);

    if(!post) throw new NotFoundException();

    if(title) post.title = title;
    if(content) post.content = content;

    posts = posts.map(newPost => newPost.id == +id ? post : newPost);

    return post;
  }


  deletePost(id:number){
    const post = posts.find(post => post.id == +id);
    if(!post) throw new NotFoundException();

    posts = posts.filter(ps => ps.id != +id);// :id가 아닌 경우만 posts에 넣기
    return id;
  }
}