import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { microfrontendAuth } from "./services/microfrontendAuth";

const httpLink = createHttpLink({
  uri: "http://localhost:3300/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = microfrontendAuth.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, networkError } = errorResponse;

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }: any) => {
      if (
        extensions?.code === "UNAUTHENTICATED" ||
        message.includes("unauthorized") ||
        message.includes("Unauthorized") ||
        message.includes("jwt") ||
        extensions?.response?.status === 401
      ) {
        console.log("Token expirado ou inválido, fazendo logout...");
        microfrontendAuth.removeToken();
      }
    });
  }

  if (networkError) {
    if (
      "statusCode" in networkError &&
      (networkError as any).statusCode === 401
    ) {
      console.log("Erro 401, fazendo logout...");
      microfrontendAuth.removeToken();
    }
  }
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});
