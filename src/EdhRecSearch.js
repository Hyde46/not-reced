import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CloseIcon from '@material-ui/icons/Close';
import {
    useAsyncCombineSeq,
    useAsyncRun,
    useAsyncTaskDelay,
    useAsyncTaskFetch,
    useAsyncTask
  } from 'react-hooks-async';


const fetchEdhRec = async ({signal}, id) => {
    //const cors_url = `https://cors-anywhere.herokuapp.com/https://edhrec-json.s3.amazonaws.com/en/top.json`;
    const url = `https://edhrec-json.s3.amazonaws.com/en/top.json`;
    const response = await fetch(url, { signal });
    const data = await response.json();
    return data;
  }

const sanitizeCardName = function(cardName) {
    cardName = cardName.toLowerCase();
    // Remove special characters
    cardName = cardName.replace(/[&\/#,+()$~%.'":*?<>{}]/g, '');
    // replace space with `-`
    cardName = cardName.replace(/[\s]/g, '-');
    return cardName;
}

const isCardRecomended = function(body, card) {
    let found_card = true;
    let card_name = ""
    let sanitzed_card = sanitizeCardName(card);
    body.container.json_dict.cardlists.forEach(json_dict => {
        json_dict.cardviews.forEach((e) => {
            if(e.sanitized === sanitzed_card){
                card_name = e.name;
                found_card = false;
            }
        })
    });
    console.log(card_name);
    return [found_card, card_name, sanitzed_card];
}

const prettyResponse = function(cardFound) {
    let base_url = "https://edhrec.com/cards/"
    let card_link = base_url + cardFound[2];
    if (cardFound[0]) {
        return (
        <div>
            <DoneAllIcon color="primary" style={{ fontSize: 40}}/>
            <p> Card not recomended by EDHRec!</p>
        </div>
        );
    } else {
        return (
            <div>
                <CloseIcon style={{ color:"#ED2939" , fontSize: 40}} />
                <p> 
                    <a href={card_link} target="_blank">{cardFound[1]} </a>
                    recomended by EDHRec!
                </p>
            </div>
            );
    }
}
  

const EdhRecSearch = ({ query }) => {
    const delayTask = useAsyncTaskDelay(500);
    const fetchTask = useAsyncTask(fetchEdhRec);
    const combinedTask = useAsyncCombineSeq(delayTask, fetchTask);
    useAsyncRun(combinedTask);
    if (delayTask.pending) return <CircularProgress/>;
    if (fetchTask.aborted) return <div>...</div>;
    if (fetchTask.error) return <div>fetchTask.error</div>;
    if (fetchTask.pending) return <div>fetchTask.abort</div>;
    const cardFound = isCardRecomended(fetchTask.result,query )
    return(prettyResponse(cardFound));
}

export default EdhRecSearch;