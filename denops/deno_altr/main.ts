import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";

export async function main(denops: Denops): Promise<void> {
  // Plugin program starts from here
  console.log("Hello Denops!");

  const hoge = "a";

  // denops.dispatcher = {
  //   async echo(text: unknown): Promise<unknown> {
  //     // assure `text` is string type.
  //     console.log('echo')
  //
  //     return await Promise.resolve();
  //   },
  // };
}
