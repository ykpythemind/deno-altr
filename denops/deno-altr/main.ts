import { Denops } from "https://deno.land/x/denops_std@v1.11.2/mod.ts#^";
import { execute } from "https://deno.land/x/denops_std@v1.11.2/helper/mod.ts#^";

import { exists } from "https://deno.land/std@0.106.0/fs/mod.ts";

import { findNextFile } from "../../src/deno-altr.ts";

export async function main(denops: Denops): Promise<void> {
  // Plugin program starts from here

  denops.dispatcher = {
    async echo(text: unknown): Promise<unknown> {
      console.log("echo");

      return await Promise.resolve();
    },
    async ask(text: unknown): Promise<unknown> {
      console.log("ask");

      let choice: number | null;

      try {
        choice = (await denops.call(
          "confirm",
          "heyhey hey",
          "A answer\nB answer"
        )) as number | null;
      } catch (e) {
        console.error(e);
        choice = 0;
      }

      console.log(choice);

      if (!choice) {
        return await Promise.resolve();
      }
      if (choice == 0) {
        console.log("cancel");
        return await Promise.resolve();
      }

      return await Promise.resolve();
    },
    async nextFile(text: unknown): Promise<unknown> {
      const currentFilePath = (await denops.call("expand", "%:p")) as
        | string
        | null;

      console.log(currentFilePath);

      if (!currentFilePath) {
        return await Promise.resolve();
      }

      const nf = await findNextFile(currentFilePath);
      if (nf.path) {
        // todo: is file exists?
        await denops.cmd(`edit ${nf.path}`);
      }

      return await Promise.resolve();
    },
  };

  await execute(
    denops,
    `command! -nargs=0 NextFile echomsg denops#request('${denops.name}', 'nextFile', [])`
  );
}
