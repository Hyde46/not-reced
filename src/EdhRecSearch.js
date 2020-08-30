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

let COMMANDER = "";
const fetchEdhRecTask = async ({signal}, name) => {
    if (COMMANDER === "" || COMMANDER === undefined || COMMANDER === null){
        return "";
    }    
    const url = `https://edhrec-json.s3.amazonaws.com/en/commanders/${COMMANDER}.json`;
    const response = await fetch(url, { signal });
    const data = await response.json();
    return data;
  }

  const fetchRecomendations = async ({signal}, id) => {
      const url = 'https://raw.githubusercontent.com/Hyde46/not-reced/master/recomendations.txt';
      const response = await fetch(url, { signal});
      const data = await response.text();
      return data;
  }

const sanitizeCardName = function(cardName) {
    cardName = cardName.toLowerCase();
    // Remove special characters
    cardName = cardName.replace(/[&\/#,+()$~%.'`":*?<>{}]/g, '');
    // replace space with `-`
    cardName = cardName.replace(/[\s]/g, '-');
    return cardName;
}
const isCardRecomended = function(body, card) {
    let found_card = false;
    let card_name = ""
    let sanitzed_card = sanitizeCardName(card);
    let cards = body.split('\n');
    cards.forEach( c => {

        if (c === sanitzed_card){
            found_card = true;
            card_name = card;
            return [found_card, card_name, sanitzed_card];
        }
    })
    return [found_card, card_name, sanitzed_card];
}
const isCommanderCardRecomended = function(body, card) {
    console.log("finding commander cards");
    if ( card === undefined || card === null || card === ""){
        return [false, "", ""];
    }
    let found_card = false;
    let card_name = ""
    let sanitzed_card = sanitizeCardName(card);
    console.log(body);
    body.container.json_dict.cardlists.forEach(json_dict => {
        json_dict.cardviews.forEach((e) => {
            if(e.sanitized === sanitzed_card){
                card_name = e.name;
                found_card = true;
            }
        })
    });
    return [found_card, card_name, sanitzed_card];
}

const prettyResponse = function(cardFound) {
    let base_url = "https://edhrec.com/cards/"
    let card_link = base_url + cardFound[2];
    if (cardFound[0]) {
        return (
            <div>
                <CloseIcon style={{ color:"#ED2939" , fontSize: 40}} />
                <p> 
                    <a href={card_link} target="_blank">{cardFound[1]} </a>
                    recomended by EDHRec!
                </p>
            </div>
            );
    } else {
        return (
            <div>
                <DoneAllIcon color="primary" style={{ fontSize: 40}}/>
                <p> Card not recomended by EDHRec!</p>
            </div>
            );
    }
}
  

const EdhRecSearch = ({ query, commanderName }) => {

    commanderName = commanderName === undefined || commanderName === null ?  "" : commanderName;
    COMMANDER = sanitizeCardName(commanderName);
    const delayCommanderTask = useAsyncTaskDelay(500);
    const fetchCommanderRecs = useAsyncTask(fetchEdhRecTask);
    const combinedCommanderTask = useAsyncCombineSeq(delayCommanderTask, fetchCommanderRecs);
    useAsyncRun(combinedCommanderTask);
   

    const delayTask = useAsyncTaskDelay(500);
    const fetchTop = useAsyncTask(fetchRecomendations);
    const combinedTask = useAsyncCombineSeq(delayTask, fetchTop);
    useAsyncRun(combinedTask);

    if (commanderName !== ""){
        if (delayCommanderTask.pending) return <CircularProgress/>;
        if (fetchCommanderRecs.aborted) return <div>...</div>;
        if (fetchCommanderRecs.error) return <div>Error while fetching data...</div>;
        if (fetchCommanderRecs.pending) return <div>Aborted</div>;
    }
    if (delayTask.pending) return <CircularProgress/>;
    if (fetchTop.aborted) return <div>...</div>;
    if (fetchTop.error) return <div>Error while fetching data...</div>;
    if (fetchTop.pending) return <div>Aborted</div>;
    const cardFound = isCardRecomended(fetchTop.result, query);
    const commanderCardFound = isCommanderCardRecomended(fetchCommanderRecs.result, COMMANDER);
    return(prettyResponse(cardFound || commanderCardFound));
}

export default EdhRecSearch;