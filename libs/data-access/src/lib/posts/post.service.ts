import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BASE_API_URL } from '@tt/shared';

import {
  CommentCreateDto,
  Post,
  PostComment,
  PostCreateDto
} from './post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  #http = inject(HttpClient);

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${BASE_API_URL}post/`, payload);
  }

  fetchPosts() {
    return this.#http.get<Post[]>(`${BASE_API_URL}post/`);
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${BASE_API_URL}comment/`, payload);
  }

  getCommentByPostId(postId: number) {
    return this.#http.get<Post>(`${BASE_API_URL}post/${postId}`);
  }
}
