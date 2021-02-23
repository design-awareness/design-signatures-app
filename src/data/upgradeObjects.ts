// upgrade database objects as needed
// this is done separately to avoid circular dependencies,
// but that means we need to trigger this check in main instead :)

import { createPresets } from "./activitySetPresets";
import { getActivitySet, getAll, onUpgradeNeeded } from "./database";

export function awaitObjectUpgradeIfNeeded() {
  onUpgradeNeeded.then(async function (from: number) {
    // a database upgrade was triggered
    // check if any objects need upgrading
    let reload = false;

    if (from <= 3) {
      // upgrade v3 to v4:
      // color values that were string should be [string, string]
      // with new dark mode support
      reload = true; // easier to rebuild
      const asids = await getAll("ActivitySet");
      await Promise.all(
        asids.map(async (id) => {
          let as = await getActivitySet(id);
          if (as.wellKnown) {
            // easier to just delete and recreate well known activity sets
            // no builtin color customization yet, so this is fine
            as.remove();
          } else {
            let oldColors = (as.colors as unknown) as string[];
            as.colors = oldColors.map((color) => [color, color]);
            await as.save();
          }
        })
      );
      // recreate the built-in activity sets
      await createPresets();
    }

    if (reload) {
      location.reload();
    }
  });
}
