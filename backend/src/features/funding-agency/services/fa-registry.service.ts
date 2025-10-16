import localRegistry from '@/../resources/ris-registry.json' with { type: "json" };

// For now we will just use these,
// because the `registry.json` also has research institutions,
// and we don't want to store them here.
const whiteListedIds = [
  "FWF", "FWF_Test"
]

function getLocalRegistryFile() {
  return localRegistry.member
}

export function updateFromRegistry() {
  var members = getLocalRegistryFile().filter(m => whiteListedIds.includes(m.id))
  return members
}
