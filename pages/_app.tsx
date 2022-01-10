import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import { getOcoinPrice } from "../utils/wax";

export const AppContext = createContext({
  tax: 2.5,
  ocoinPrice: 0,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [ocoinPrice, setOcoinPrice] = useState(0);

  getOcoinPrice().then((lastPrice) => setOcoinPrice(lastPrice));

  return (
    <AppContext.Provider value={{ tax: 2.5, ocoinPrice }}>
      <div className="">
        <Component {...pageProps} />
      </div>
    </AppContext.Provider>
  );
}

export default MyApp;
