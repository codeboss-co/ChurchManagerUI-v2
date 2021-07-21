import { Route } from '@angular/router';
import { ScrumboardBoardsComponent } from '../scrumboard/boards/boards.component';
import { ScrumboardBoardResolver, ScrumboardBoardsResolver, ScrumboardCardResolver } from '../scrumboard/scrumboard.resolvers';
import { ScrumboardBoardComponent } from '../scrumboard/board/board.component';

export const scrumboardRoutes: Route[] = [
    {
        path     : '',
        component: ScrumboardBoardsComponent,
        resolve  : {
            boards: ScrumboardBoardsResolver
        }
    },
    {
        path     : ':boardId',
        component: ScrumboardBoardComponent,
        resolve  : {
            board: ScrumboardBoardResolver
        }
    }
];
