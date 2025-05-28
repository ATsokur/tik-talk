import { Route } from '@angular/router';
import { ChatsPageComponent } from './chats-page.component';
import { ChatWorkspaceComponent } from './chat-workspace/chat-workspace.component';

export const chatsRouters: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [
      {
        path: ':id',
        component: ChatWorkspaceComponent,
      },
    ],
  },
];
