import { Injectable } from '@angular/core';

import { Apollo,gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { GraphqlQuery } from '../constant';


interface UserData {
  
    token: string;
    userId: string;
  
}

interface LoginResponse {
  login: UserData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  TOKEN_KEY = 'token';
  user = new BehaviorSubject<UserData | null>(null);

  constructor(private apollo: Apollo) { }

  login(email:string,password:string) {
    return this.sendQuery(GraphqlQuery.login("token userId"),{email,password});
  }

  register(name:string,email:string,password:string) {
    return this.sendMutation(GraphqlQuery.register("email"),{email,name,password});
  }

  sendQuery(graphqlQuery:string,parameters?:any):Observable<any> {
    return new Observable((observer) => {
      this.apollo.query({
        query:gql`${graphqlQuery}`,
        variables: parameters? parameters : undefined,
      }).subscribe({next: res => {
        observer.next({status:'success',data:res.data});
        observer.complete();
      },error:error=>{
        observer.next({status:'failed',message:this.handlerError(error)})
        observer.complete();
      }})
    });
  }

  sendMutation(graphqlQuery:string,parameters?:any):Observable<any> {
    return new Observable((observer) => {
      this.apollo.mutate({
        mutation:gql`${graphqlQuery}`,
        variables: parameters? parameters : undefined,
      }).subscribe({next: res => {
        observer.next({status:'success',data:res.data});
        observer.complete();
      },error:error=>{
        observer.next({status:'failed',message:this.handlerError(error)})
        observer.complete();
      }})
    });
  }


  handlerError(error:any) {
    if(error?.networkError?.error?.errors?.length > 0 ){
      return error.networkError.error.errors[0].message;
    }
    return 'Something went wrong';
  }
}
