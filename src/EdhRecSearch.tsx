import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  useAsyncCombineSeq,
  useAsyncRun,
  useAsyncTaskDelay,
  useAsyncTaskFetch,
} from 'react-hooks-async';

const Err: React.SFC<{ error: Error }> = ({ error }) => (
  <div>Error: {error.name} {error.message}</div>
);

const Loading: React.SFC<{ abort: () => void }> = ({ abort }) => (
  <CircularProgress/>
);

/* eslint-disable camelcase, @typescript-eslint/camelcase */

const EdhRecSearch: React.FC<{ query: string }> = ({ query }) => {
  const url = `https://cors-anywhere.herokuapp.com/https://edhrec.com/top`;
  const delayTask = useAsyncTaskDelay(500);
  const fetchTask = useAsyncTaskFetch(url);
  const combinedTask = useAsyncCombineSeq(delayTask, fetchTask);
  useAsyncRun(combinedTask);
  if (delayTask.pending) return <CircularProgress/>;
  if (fetchTask.aborted) return <Err error={new Error('Aborted')} />;
  if (fetchTask.error) return <Err error={fetchTask.error} />;
  if (fetchTask.pending) return <Loading abort={fetchTask.abort} />;
  return (<div>done</div>);
  /*
  return (
    <ul>
      {fetchTask.result.items.map(({ id, name, html_url }) => (
        <li key={id}><a target="_blank" rel="noreferrer noopener" href={html_url}>{name}</a></li>
      ))}
    </ul>
  );*/
};

export default EdhRecSearch;

