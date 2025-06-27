import { inject, Injectable } from '@angular/core';

import { map, switchMap } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { PostService } from '../post.service';
import { commentsActions, postsActions } from './actions';
import { PostComment } from '../post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsEffects {
  #postService = inject(PostService);
  actions$ = inject(Actions);

  fetchPosts = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.fetchPosts),
      switchMap(() => {
        return this.#postService.fetchPosts();
      }),
      map((posts) => postsActions.postsLoaded({ postsList: posts }))
    );
  });

  createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createPost),
      switchMap(({ postPayload }) => {
        return this.#postService.createPost(postPayload);
      }),
      map(() => postsActions.fetchPosts())
    );
  });

  fetchComments = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.postsLoaded),
      map(({ postsList }) => {
        return postsList.reduce(
          (acc: Record<string, PostComment[]>, { id, comments }) => {
            acc[id] = comments;
            return acc;
          },
          {}
        );
      }),
      map((comments) => commentsActions.commentsLoaded({ comments }))
    );
  });

  createComment = createEffect(() => {
    return this.actions$.pipe(
      ofType(commentsActions.createComment),
      switchMap(({ payload }) => {
        return this.#postService.createComment(payload);
      }),
      map(() => postsActions.fetchPosts())
    );
  });
}
