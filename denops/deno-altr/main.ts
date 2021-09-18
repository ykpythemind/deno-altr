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
