import Home from '@popup/Home.tsx';
import { HashRouter, Route } from '@solidjs/router';
import { render } from 'solid-js/web';

render(
  () => (
    <HashRouter>
      <Route path="/" component={Home} />
    </HashRouter>
  ),
  document.getElementById('root')!,
);
