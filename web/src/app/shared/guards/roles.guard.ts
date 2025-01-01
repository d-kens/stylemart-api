import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/data-access/services/auth.service';
import { User } from '../../auth/data-access/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    const requiredRole: string = route.data['role'];

    return this.authService.getAuthenticatedUser().pipe(
      map((user: User) => {
        if(user.role !== requiredRole) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    )
  }

}