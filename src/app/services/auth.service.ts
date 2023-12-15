import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from "rxjs";
import { Usuario } from "../models/usuario.model";
import { UsuarioRol } from "../models/usuarioRol.model";
import { HttpClient } from "@angular/common/http";
import { enviroment } from "../../enviroments/enviroment.prod";
import { LoginStateServiceService } from "./login-state-service.service";
import { UsuarioRolService } from "./usuario-rol.service";
import { RolService } from "./rol.service";
import { PlayerService } from "./player.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private baseUrl = enviroment.authUrl;

    private hasManagerRoleSubject = new BehaviorSubject<boolean>(false);
    hasManagerRole$ = this.hasManagerRoleSubject.asObservable();

    constructor(private http: HttpClient,
        private router: Router,
        private loginStateService: LoginStateServiceService,
        private usuarioRolService: UsuarioRolService,
        private rolService: RolService,
        private playerService: PlayerService,
        private jwtHelper: JwtHelperService
        ){}

        login(userName: string, password: string): Observable<boolean>{
            return this.http.post<{ token: string; userName: string }>(
                `${this.baseUrl}/auth/login`,
                { userName: userName, password:password }
            ).pipe(
                tap(result => {
                    localStorage.setItem('token', result.token);
                }),
                switchMap(() => {
                    return this.getUserByEmail(userName)
                }),
                tap(user => {
                    this.storeUser(user);
                    this.loginStateService.changeLoginState(true);
                }),
                map(user => true),
                catchError(error => {
                    console.error(error);
                    return of(false);
                })
            );
        }

        private isTokenExpired(token: string): boolean {
            const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
            const isExpired = this.jwtHelper.isTokenExpired(token);
            return isExpired;
        }

        //Metodo para obtener el objeto Usuario por email
        getUserByEmail(email: string): Observable<Usuario>{
            const url = `${this.baseUrl}/api/usuarios/userName/${email}`;
            return this.http.get<Usuario>(url);
        }

        //Metodo para almacenar el objeto Usuario en el localStorage
        storeUser(user: Usuario){
            localStorage.setItem('currentUser', JSON.stringify(user));
        }

        //logout
        logout(){
            localStorage.removeItem('token');
            this.loginStateService.changeLoginState(false);
        }

        get isLoggedIn(): boolean{
            const token = localStorage.getItem('token');
            return token != null && !this.isTokenExpired(token);
        }

        redirectToTipoPage(tipo: string){
            if(tipo === 'ADMIN'){
                this.router.navigate(['/admin']);
            }else {
                this.router.navigate(['/player']);
            }
        }

        get user(): Usuario | null{
            const userJson = localStorage.getItem('currentUser');
            if(userJson){
                return JSON.parse(userJson) as Usuario;
            }
            return null;
        }

        //verificar si el usuario tiene el rol de "ROLE_MANAGER"
        public async hasManagerRole(): Promise<boolean>{
            const user = this.user?.roles;
            if(user) {
                const usuarioRolPromises = user.map(rol => this.usuarioRolService.findById(rol).toPromise());
                const usuarioRols = await Promise.all(usuarioRolPromises);
                const idRoles = usuarioRols.map(usuarioRol => usuarioRol?.rol?.id);
                const rolPromises = idRoles.map(idRol => idRol ? this.rolService.findById(idRol).toPromise() : Promise.resolve(null));
                const roles = await Promise.all(rolPromises);
                const hasManagerRole = roles.some(rol => rol && rol.nombre === 'ROLE_MANAGER');
                    if(hasManagerRole){
                        console.log('El usuario tiene el rol de manager');
                        return true;
                    }else{
                        console.log('El usuario no tiene el rol de manager');
                        return false;
                    }
            }
            return false;
        }

        getAdminId(): number | undefined{
            const user = this.user;
            if(user){
                return user.id;
            }
            return undefined;
        }

        getPlayerId(): Observable<number | undefined>{
            const user = this.user;
            if(user){
                return this.playerService.findByidUser(user.id).pipe(
                    map(player => player?.idPlayer),
                    catchError(error => {
                        console.error(error);
                        return of(undefined);
                    })
                );
            }
            return of(undefined);
        }

        isAdmin(): boolean{
            const token = localStorage.getItem('token');
            if(token){
                const decodedToken = this.jwtHelper.decodeToken(token);
                const roles = decodedToken.roles;
                return roles && roles.includes('ROLE_ADMIN');
            }
            return false;
        }

        public isPlayer(): boolean{
            const token = localStorage.getItem('token');
            if(token){
                const decodedToken = this.jwtHelper.decodeToken(token);
                const roles = decodedToken.roles;
                return roles && roles.includes('ROLE_PLAYER');
            }
            return false;
        }
}