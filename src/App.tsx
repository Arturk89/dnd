import Main from './components/Main';
import { Widgets } from './types';
import './App.css';

const widgets: Widgets[] = [
  {
    id: 1,
    text: "ITINERARY",
  },
  {
    id: 2,
    text: "MENU",
  },
  {
    id: 3,
    text: "CREW",
  },
  {
    id: 4,
    text: "INFO",
  },
  {
    id: 5,
    text: "MESSAGES",
  }
]

function App() {

  return (
    <div className="app">
      <Main widgets={widgets} />
    </div>
  );
}

export default App;
