import { Denops } from "https://deno.land/x/denops_std@v1.11.2/mod.ts#^";
import { execute } from "https://deno.land/x/denops_std@v1.11.2/helper/mod.ts#^";

import { exists } from "https://deno.land/std@0.106.0/fs/mod.ts";

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

// todo: multiple destfile??
interface DestFile {
  path?: string;
}

const findNextFile = async (currentFile: string): Promise<DestFile> => {
  let dest: DestFile = {};

  if (currentFile.includes("app/")) {
    let newPath = currentFile
      .replace("/app/", "/spec/")
      .replace(".rb", "_spec.rb");

    if (currentFile.includes("/controllers/")) {
      newPath = newPath.replace("/controllers/", "/requests/");
    }

    dest.path = newPath;
  } else if (currentFile.endsWith("_spec.rb")) {
    let newPath = currentFile
      .replace("/spec/", "/app/")
      .replace("_spec.rb", ".rb");

    if (currentFile.includes("/requests/")) {
      newPath = newPath.replace("/requests/", "/controllers/");
    }

    dest.path = newPath;
  }

  return dest;
};
