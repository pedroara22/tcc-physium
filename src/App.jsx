import Engine from './components/engine';
import './App.css';
import { useEffect } from 'react';

function App() {

  var created = false, engine;

  useEffect(() => {
    if (!created) {
      if (document.body.getElementsByTagName('canvas').length > 0){
        created = true;
        return;
      }

      engine = new Engine();
      created = true;
    }

  }, [])

  function resetWorld(){
    engine.reset();
  }


  return (
    <div className="App">
      <h1>Physics</h1>
      <button onClick={resetWorld}>Reset</button>
      <button onClick={() => engine.addBody()}>Add Body</button>
      <button onClick={() => engine.option=='addSquare'?engine.changeOption("addSquare"):engine.changeOption("moveItem")}>Add Square</button>
    </div>
  );
}

export default App;
