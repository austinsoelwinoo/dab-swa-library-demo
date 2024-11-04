import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css';

import BookList from './Components/BookList/BookList';

const client = new ApolloClient({
  uri: '/data-api/graphql',
  cache: new InMemoryCache({
    addTypename: false
  })
});


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="maxWidth1200Centered">
        <BookList />
      </div>
    </ApolloProvider>
  );
}

export default App;
