import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "http://localhost:3300/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("jwt_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError((error) => {
  const { graphQLErrors, networkError } = error as any;

  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.error(
        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
      );
    }
  }

  if (networkError && networkError.statusCode === 401) {
    console.log(
      "Erro 401 Unauthorized detectado. Redirecionando para login..."
    );
    localStorage.removeItem("jwt_token");
    window.location.href = "/login";
  }
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});
