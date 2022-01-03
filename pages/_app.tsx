import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext } from "react";

export const AppContext = createContext({
  tax: 2.5,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContext.Provider value={{ tax: 2.5 }}>
      <div className="">
        <Component {...pageProps} />
      </div>
    </AppContext.Provider>
  );
}

export default MyApp;
