import "./App.css";
import GoogleFormEmbed from "./Component/GoogleFormEmbed";
import PriceCalculator from "./Component/PriceCalculator";

function App() {
  return (
    <div className="w-full p-4">
      <PriceCalculator />
      <GoogleFormEmbed/>
    </div>
  );
}

export default App;
