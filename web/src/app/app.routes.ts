import { Routes } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { CreateCategoryComponent } from './admin/ui/category/create-category/create-category.component';
import { CreateProductComponent } from './admin/ui/product/create-product/create-product.component';
import { AdminProductsComponent } from './admin/ui/product/admin-products/admin-products.component';
import { AdminCategoriesComponent } from './admin/ui/category/admin-categories/admin-categories.component';

export const routes: Routes = [
    {
        path: 'auth/sign-up',
        component: SignUpComponent
    },
    {
        path: 'auth/sign-in',
        component: SignInComponent
    },
    {
        path: 'auth/forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'auth/reset-password',
        component: ResetPasswordComponent,
    },
    {
        path: 'auth/verify-email',
        component: EmailVerificationComponent,
    },
    {
        path: 'admin/categories/list',
        component: AdminCategoriesComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
    },
    {
        path: 'admin/categories/create',
        component: CreateCategoryComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
    },
    {
        path: 'admin/products/create',
        component: CreateProductComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
    },
    {
        path: 'admin/products/list',
        component: AdminProductsComponent,
        canActivate: [AuthGuard, RolesGuard],
        data: {
            role: 'ADMIN'
        }
      },
];
