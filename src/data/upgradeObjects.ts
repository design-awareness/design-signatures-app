// upgrade database objects as needed
// this is done separately to avoid circular dependencies,
// but that means we need to trigger this check in main instead :)

import { onUpgradeNeeded } from "./database";

export function awaitObjectUpgradeIfNeeded() {
  onUpgradeNeeded.then(async function (from: number) {
    // a database upgrade was triggered
    // check if any objects need upgrading
    let reload = false;

    // for example,
    if (from < 0) {
      // update from version 0 to version 1
    }

    if (reload) {
      location.reload();
    }
  });
}
