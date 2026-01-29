import React, { Suspense } from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo";

import CotaManager from "./components/CotaManager";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <main>
          <Suspense fallback={<div>Carregando Cotas...</div>}>
            <CotaManager />
          </Suspense>
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
