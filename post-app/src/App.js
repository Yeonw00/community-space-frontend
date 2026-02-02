import './App.css';
// import Counter from './components/counter/Counter';
// import Counter from './components/myCounter/Counter'
import PostApp from './components/community/PostApp';

function App() {
  return (
    <div className="App">
      {/* <PlayingWithProps property1="value1" property2="value2"/> */}
      <PostApp />
    </div>
  );
}

// function PlayingWithProps(properties) {
//   console.log(properties)
//   console.log(properties.property1)
//   console.log(properties.property2)

//   return(
//     <div>props</div>
//   ) 
// }

// function PlayingWithProps({property1, property2}) {
//   console.log(property1)
//   console.log(property2)

//   return(
//     <div>props</div>
//   ) 
// }

export default App;
