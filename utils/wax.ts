import { JsonRpc } from "eosjs";

export const account = process.env.ACCOUNT as string;

export const rpc = new JsonRpc("http://wax.pink.gg");

export interface GetTableRowParams {
  json?: boolean;
  code?: string;
  scope?: string;
  table?: string;
  lower_bound?: any;
  upper_bound?: any;
  index_position?: number;
  key_type?: string;
  limit?: number;
  reverse?: boolean;
  show_payer?: boolean;
}

export type GetTableRowOptions = Omit<GetTableRowParams, "table"> & {
  query?: string;
}

export const getData = async ({
  game = "farminggames",
  table,
  options = {},
}: {
  game?: string;
  table: string;
  options?: GetTableRowOptions;
}) => {
  const { upper_bound, lower_bound, query, ...rest } = options;
  const { rows } = await rpc.get_table_rows({
    json: true,
    code: game,
    scope: game,
    table,
    limit: 100,
    upper_bound: query || upper_bound || null,
    lower_bound: query || lower_bound || null,
    ...rest,
  });
  return rows;
};

export const sleepRandomly = async () => {
  const sleepTime = Math.random() * 7000 + 3000; // Sleep for 3 - 10 seconds
  return new Promise((resolve) => {
    setTimeout(resolve, sleepTime);
  });
};
