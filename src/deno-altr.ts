import { exists } from "https://deno.land/std@0.106.0/fs/mod.ts";

// todo: multiple destfile??
export interface AltrFile {
  path: string;
  exists: boolean;
}

interface findOption {
  currentFile: string;
  vimFileType: string;
}

type FileCandidate = string;

export const find = async ({
  currentFile,
  vimFileType,
}: findOption): Promise<AltrFile | null> => {
  let target: FileCandidate | null = null;

  if (vimFileType === "ruby") {
    target = searchCandidateRuby(currentFile);
  } else if (vimFileType === "go") {
    target = searchCandidateGo(currentFile);
  }

  if (!target) {
    return null;
  }

  const fileExists = await exists(target);

  return { path: target, exists: fileExists };
};

const searchCandidateRuby = (currentFile: string): FileCandidate | null => {
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

const searchCandidateGo = (currentFile: string): FileCandidate | null => {
  if (currentFile.endsWith("_test.go")) {
    return currentFile.replace("_test", "");
  } else {
    return currentFile.replace(/\.go$/, "_test.go");
  }
};
