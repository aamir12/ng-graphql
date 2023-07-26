import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';
import { onError } from '@apollo/client/link/error';
 


const uri = 'http://localhost:8080/graphql'; // <-- add the URL of the GraphQL server here

const tokenMiddleware = new ApolloLink((operation, forward) => {
  const token = 'Test'//localStorage.getItem(GC_AUTH_TOKEN);
  if (token) {
    operation.setContext({
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }
  return forward(operation);
});

const errorMiddleWare = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );
 
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const allLinks = ApolloLink.from([
    errorMiddleWare,
    tokenMiddleware,
    httpLink.create({uri}),
 ]);
 
  return {
    link: allLinks,
    cache: new InMemoryCache(),
  };
}



@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
