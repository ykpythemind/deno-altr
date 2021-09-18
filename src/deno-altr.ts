// todo: multiple destfile??
export interface AltrFile {
  path?: string;
}

export const findNextFile = async (currentFile: string): Promise<AltrFile> => {
  let dest: AltrFile = {};

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
