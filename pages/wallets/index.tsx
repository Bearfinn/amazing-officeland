import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import WalletCard from "../../components/WalletCard";
dayjs.extend(duration);

interface WalletPageProps {}

const WalletPage: FunctionComponent<WalletPageProps> = () => {
  const { query, push, reload } = useRouter();
  const { a } = query;

  const [names, setNames] = useState<string>("");

  useEffect(() => {
    setNames((a as string) || "");
  }, [a]);

  const updateWallet = () => {
    push({
      pathname: "/wallets",
      query: {
        a: names,
      }
    })
  }

  console.log(a, names)

  const accounts = a ? (a as string).split(",") : [];

  return (
    <div className="container mx-auto">
      <div className="text-2xl text-center my-8">Wallet Inspector (BETA)</div>
      <div className="text-center">
        <div>Wallet names (separated by comma)</div>
        <input
        className="bg-gray-700 px-4 py-2"
          type="text"
          value={names}
          onChange={(e) => setNames(e.target.value)}
        ></input>
        <button className="px-4 py-2 rounded bg-red-500" onClick={() => updateWallet()}>
          Load
        </button>
      </div>
      <div className="grid grid-cols-12">
        {accounts &&
          typeof accounts !== "string" &&
          accounts.length > 0 &&
          accounts.map((account) => {
            return (
              <div
                className="col-span-12 md:col-span-6 lg:col-span-4"
                key={account}
              >
                <WalletCard address={account} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default WalletPage;
