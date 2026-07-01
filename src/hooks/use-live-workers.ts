import { useCallback, useMemo } from "react"
import { RecordId } from "surrealdb"
import { useLiveQuery } from "./use-live-query"
import { extractId, type SurrealWorker } from "@/types/surreal-records"
import { compareWorkersForDisplay } from "@utils/worker-display"

const isOnline = (w: SurrealWorker) => w.status === "online"

/** All workers ordered by display name (stable sidebar ordering). */
export const useLiveWorkers = () =>
  useLiveQuery<SurrealWorker>({
    initialQuery: "SELECT * FROM worker",
    liveTable: "worker",
    orderBy: compareWorkersForDisplay,
  })

/** Single worker detail by ID. */
export const useWorker = (workerId: string) => {
  const bindings = useMemo(() => ({ rid: new RecordId("worker", workerId) }), [workerId])
  const filter = useCallback((w: SurrealWorker) => extractId(w.id) === workerId, [workerId])

  const result = useLiveQuery<SurrealWorker>({
    initialQuery: "SELECT * FROM $rid",
    liveTable: "worker",
    bindings,
    filter,
    enabled: !!workerId,
  })

  return {
    ...result,
    worker: result.data[0] ?? null,
  }
}

/** Online workers only — filtered by status field set by the backend poller. */
export const useOnlineWorkers = () =>
  useLiveQuery<SurrealWorker>({
    initialQuery: "SELECT * FROM worker WHERE status = 'online'",
    liveTable: "worker",
    orderBy: compareWorkersForDisplay,
    filter: isOnline,
  })
