import { redux } from 'topcoder-react-utils';
import Service from 'services/mmLeaderboard';
import _ from 'lodash';

/**
 * Fetch init
 */
function getMMLeaderboardInit(id) {
  return { id };
}

/**
 * Fetch done
 */
async function getMMLeaderboardDone(id) {
  const ss = new Service();
  const res = await ss.getMMLeaderboard(id);
  let data = [];
  if (res) {
    const groupedData = _.groupBy(res.subs, 'createdBy');
    _.each(groupedData, (subs, handle) => {
      const sortedSubs = _.orderBy(subs, ['updated'], ['desc']);
      data.push({
        createdBy: handle,
        updated: sortedSubs[0].submittedDate,
        id: sortedSubs[0].id,
        score: _.orderBy(_.compact(sortedSubs[0].review), ['updated'], ['desc'])[0].score,
      });
    });
    data = _.orderBy(data, ['score', 'updated'], ['desc']).map((r, i) => ({
      ...r,
      rank: i + 1,
      score: r.score % 1 ? Number(r.score).toFixed(5) : r.score,
    }));
  }
  return {
    id,
    data,
  };
}

export default redux.createActions({
  MMLEADERBOARD: {
    GET_MML_INIT: getMMLeaderboardInit,
    GET_MML_DONE: getMMLeaderboardDone,
  },
});