import OpenInNewTab from './features/OpenInNewTab.tsx';
import MainContainer from './components/MainContainer.tsx';

export const Home = () => {
  return (
    <MainContainer>
      <h1 class="text-2xl font-bold">Home</h1>
      <p>Welcome to the home page!</p>
      <OpenInNewTab />
    </MainContainer>
  );
};

export default Home;
