import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { from } from 'apollo-link';
import App from './components/App';
import {
  authLink,
  omitTypeNameLink,
  errorLink,
  uploadLink,
} from './graphql/ApolloLinks';

const client = new ApolloClient({
  link: from([
    authLink,
    omitTypeNameLink,
    errorLink,
    // httpLink,
    uploadLink,
  ]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
