import { Denops } from "https://deno.land/x/denops_std@v1.11.2/mod.ts#^";
import { execute } from "https://deno.land/x/denops_std@v1.11.2/helper/mod.ts#^";

import { find } from "../../src/deno-altr.ts";

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

      const altrFile = await find(currentFilePath);
      if (!altrFile) {
        console.error("altr file not found");
        return await Promise.resolve();
      }

      let doEdit = true;

      if (!altrFile.exists) {
        let choice: number | null;

        try {
          choice = (await denops.call(
            "confirm",
            `${altrFile.path} does not exist. edit?`,
            "y yes\nn no"
          )) as number | null;
        } catch (e) {
          choice = 0;
        }

        if (!choice || choice === 0) {
          doEdit = false;
        }
      }

      if (doEdit) {
        await denops.cmd(`edit ${altrFile.path}`);
      }

      return await Promise.resolve();
    },
  };

  await execute(
    denops,
    `command! -nargs=0 NextFile echomsg denops#request('${denops.name}', 'nextFile', [])`
  );
}
