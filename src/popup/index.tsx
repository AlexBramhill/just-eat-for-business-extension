import { HashRouter, Route } from '@solidjs/router';
import { render } from 'solid-js/web';
import Home from './Home.tsx';

render(
  () => (
    <HashRouter>
      <Route path="/" component={Home} />
    </HashRouter>
  ),
  document.getElementById('root')!,
);
