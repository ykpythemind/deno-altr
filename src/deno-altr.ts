import { exists } from "https://deno.land/std@0.106.0/fs/mod.ts";

// todo: multiple destfile??
export interface AltrFile {
  path: string;
  exists: boolean;
}

export type FileCandidate = string;

export const find = async (currentFile: string): Promise<AltrFile | null> => {
  const target = searchCandidate(currentFile);

  if (!target) {
    return null;
  }

  const fileExists = await exists(target);

  return { path: target, exists: fileExists };
};

export const searchCandidate = (currentFile: string): FileCandidate | null => {
  if (currentFile.includes("app/")) {
    let newPath = currentFile
      .replace("/app/", "/spec/")
      .replace(".rb", "_spec.rb");

    if (currentFile.includes("/controllers/")) {
      newPath = newPath.replace("/controllers/", "/requests/");
    }

    return newPath;
  } else if (currentFile.endsWith("_spec.rb")) {
    let newPath = currentFile
      .replace("/spec/", "/app/")
      .replace("_spec.rb", ".rb");

    if (currentFile.includes("/requests/")) {
      newPath = newPath.replace("/requests/", "/controllers/");
    }

    return newPath;
  }

  // found nothing
  return null;
};
