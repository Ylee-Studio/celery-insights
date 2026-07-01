import { extractId, parseWorkerInspect, type SurrealWorker } from "@/types/surreal-records"

const DOCKER_CONTAINER_ID_PATTERN = /^[a-f0-9]{12}$/i

/** Celery nodename, e.g. celery@544156f07d8b */
export function getWorkerNodeId(worker: SurrealWorker): string {
  return worker.hostname || extractId(worker.id)
}

function queueNamesFromInspect(worker: SurrealWorker): string[] {
  const inspect = parseWorkerInspect(worker)
  if (!inspect?.active_queues?.length) {
    return []
  }

  return inspect.active_queues
    .map((queue) => queue.name)
    .filter((name): name is string => Boolean(name))
}

/**
 * Human-readable worker label for UI.
 * Prefers Celery queue names (matches compose service purpose), not Docker container IDs.
 */
export function getWorkerDisplayName(worker: SurrealWorker): string {
  const queueNames = queueNamesFromInspect(worker)
  if (queueNames.length > 0) {
    return queueNames.join(", ")
  }

  const nodeId = getWorkerNodeId(worker)
  const atIndex = nodeId.indexOf("@")
  if (atIndex < 0) {
    return nodeId
  }

  const prefix = nodeId.slice(0, atIndex)
  const hostPart = nodeId.slice(atIndex + 1)
  if (!DOCKER_CONTAINER_ID_PATTERN.test(hostPart)) {
    return hostPart
  }

  return prefix || nodeId
}

/** Stable sidebar ordering: queue/name first, nodename tie-breaker. */
export function compareWorkersForDisplay(left: SurrealWorker, right: SurrealWorker): number {
  const nameCompare = getWorkerDisplayName(left).localeCompare(getWorkerDisplayName(right), undefined, {
    sensitivity: "base",
  })
  if (nameCompare !== 0) {
    return nameCompare
  }

  return getWorkerNodeId(left).localeCompare(getWorkerNodeId(right), undefined, { sensitivity: "base" })
}
