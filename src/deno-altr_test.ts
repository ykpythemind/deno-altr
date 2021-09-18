import {
  assertEquals,
  fail,
} from "https://deno.land/std@0.107.0/testing/asserts.ts";

import { searchCandidate, FileCandidate } from "./deno-altr.ts";

Deno.test("search Candidate", () => {
  const tests: Array<{ currentFile: string; expect: FileCandidate | null }> = [
    {
      currentFile: "/home/ykpythemind/fuga/app/models/user.rb",
      expect: "/home/ykpythemind/fuga/spec/models/user_spec.rb",
    },
    {
      currentFile: "/home/ykpythemind/fuga/app/controllers/users_controller.rb",
      expect: "/home/ykpythemind/fuga/spec/requests/users_controller_spec.rb",
    },
    { currentFile: "/home/ykpythemind/hoge.txt", expect: null },
  ];

  tests.forEach((t) => {
    const candidates = searchCandidate(t.currentFile);
    assertEquals(candidates, t.expect);
  });
});
