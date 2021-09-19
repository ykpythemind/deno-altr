import {
  assertEquals,
  fail,
} from "https://deno.land/std@0.107.0/testing/asserts.ts";

import {
  searchCandidateRuby,
  searchCandidateGo,
  FileCandidate,
} from "./deno-altr.ts";

Deno.test("search Candidate ruby", () => {
  const tests: Array<{ currentFile: string; expect: FileCandidate | null }> = [
    {
      currentFile: "/home/ykpythemind/fuga/app/models/user.rb",
      expect: "/home/ykpythemind/fuga/spec/models/user_spec.rb",
    },
    {
      currentFile: "/home/ykpythemind/fuga/spec/models/user_spec.rb",
      expect: "/home/ykpythemind/fuga/app/models/user.rb",
    },
    { currentFile: "/home/ykpythemind/hoge.txt", expect: null },
    {
      currentFile: "/home/ykpythemind/fuga/app/controllers/users_controller.rb",
      expect: "/home/ykpythemind/fuga/spec/requests/users_controller_spec.rb",
    },
    {
      currentFile:
        "/home/ykpythemind/fuga/spec/requests/users_controller_spec.rb",
      expect: "/home/ykpythemind/fuga/app/controllers/users_controller.rb",
    },
  ];

  tests.forEach((t) => {
    const candidates = searchCandidateRuby(t.currentFile);
    assertEquals(candidates, t.expect);
  });
});

Deno.test("search Candidate go", () => {
  const tests: Array<{ currentFile: string; expect: FileCandidate | null }> = [
    {
      currentFile: "/home/ykpythemind/fuga/main.go",
      expect: "/home/ykpythemind/fuga/main_test.go",
    },
    {
      currentFile: "/home/ykpythemind/fuga/piyo/hoge_test.go",
      expect: "/home/ykpythemind/fuga/piyo/hoge.go",
    },
  ];

  tests.forEach((t) => {
    const candidates = searchCandidateGo(t.currentFile);
    assertEquals(candidates, t.expect);
  });
});
