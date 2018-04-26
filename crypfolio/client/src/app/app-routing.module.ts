import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { CoinChangeComponent } from './coin/coin-change/coin-change.component';
// import { CoinListComponent } from './coin/coin-main/coin-list/coin-list.component';

import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { TransactionComponent } from "./transaction/transaction.component";
import { PortfolioComponent } from "./portfolio/portfolio.component";


const routes: Routes = [
  {
    path: 'auth' ,
    loadChildren: 'app/auth/auth.module#AuthModule'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'transaction',
        component: TransactionComponent,
      },
      {
        path: '',
        component: PortfolioComponent,
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
