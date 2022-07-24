import { useEffect } from "react";
import * as React from "react";
import { PersistanceStore } from "../storage/storage";
import _ from "lodash";
import async from "async";
import { UnderwriterTransferRequest } from "zero-protocol/dist/lib/zero";
import { NotificationHelper } from "../notification/helper";
import { useNotificationContext } from "../notification";

export function usePersistanceRefresh(dispatch) {
  const { card, cardDispatch } = useNotificationContext();
  const Notify = new NotificationHelper(card, cardDispatch);

  let queue = async.queue((task, callback) => {
    callback(null, task);
  });

  useEffect(async () => {
    let fetchedData = await PersistanceStore.get_all_data();
    let transformedData = _.chain(fetchedData)
      .groupBy((i) => i.status)
      .transform((result, value, key) => {
        let t = _.transform(
          value,
          (result, key) => {
            result.push(JSON.parse(key.data));
          },
          []
        );
        let tx = _.groupBy(t, (i) => (i.type ? i.type : i.requestType));
        result[key == "pending" ? key : "completed"] = tx;
      }, {})
      .value();

    if (!_.isEmpty(transformedData)) {
      let dataSettled = {
        pending: {
          burn: [],
          transfer: [],
        },
        completed: {
          burn: [],
          transfer: [],
        },
      };

      let merged = _.merge(dataSettled, transformedData);
      if (!_.isEmpty(merged.pending.transfer)) {
        getPendingRequestStatus(
          merged.pending.transfer,
          queue,
          dispatch,
          Notify
        );
      }
      dispatch({ type: "INIT", payload: merged });
    }
  }, []);
}

export function getPendingRequestStatus(array, queue, dispatch, Notify) {
  for (const i of array) {
    queue.push(i, callback);
  }

  async function callback(error, task) {
    const req = new UnderwriterTransferRequest({
      ...task._data,
    });

    const mint = await req.submitToRenVM();

    mint.on("transaction", (transaction) => {
      let forwarded = null;
      transaction.in.wait().on("progress", (progress) => {
        if (!forwarded && progress.confirmations >= 6) {
          dispatch({
            type: "COMPLETE",
            payload: {
              type: task.type,
              id: task.id,
              data: task._data,
            },
          });
          PersistanceStore.add_data(task.id, task, "completed");
        } else {
          if (!forwarded) {
            const { id, dispatch } = Notify.createTXCard(true, task.type, {
              hash: task.transactionHash,
              confirmed: true,
              data: task._data,
              max: progress.target,
              current:
                progress.confirmations == 0 ? 0 : progress.confirmations + 1,
            });
            forwarded = { id: id, dispatch: dispatch };
          } else if (progress.confirmations >= progress.target) {
            forwarded.dispatch({
              type: "REMOVE",
              payload: { id: forwarded.id },
            });
          } else {
            forwarded.dispatch({
              type: "UPDATE",
              payload: {
                id: forwarded.id,
                update: {
                  max: progress.target,
                  current: progress.confirmations + 1,
                },
              },
            });
          }
        }
      });
    });
  }
}
