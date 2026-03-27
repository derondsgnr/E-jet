 /**
 * JET ADMIN — COMMAND CENTER VIEW
 *
 * The default admin view (index route under /admin).
 * Renders the Command Center composite inside the admin shell.
 */

import { CommandCenterComposite } from "../components/admin/command-center-composite";

export function AdminCommandCenter() {
  return <CommandCenterComposite />;
}
