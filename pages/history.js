import { Card, ListGroup, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";

import styles from '../styles/History.module.css';
import { removeFromHistory } from "../lib/UserData";

export default function History() {

    const router = useRouter();
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
   
    if(!searchHistory){
        return null;
    }

    let parsedHistory = [];

    searchHistory.forEach((h) => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    function historyClicked(e, index){
        router.push(`/artwork?${searchHistory[index]}`);
    }

    async function removeHistoryClicked(e, index){
        e.stopPropagation(); 
        setSearchHistory(await removeFromHistory(searchHistory[index]));
    }

    if(parsedHistory.length === 0){
        return(<>
            <Card>
                <Card.Body>
                    <Card.Text>
                        <h4>Nothing Here</h4>
                        Try searching for some artwork
                    </Card.Text>
                </Card.Body>
            </Card>
        </>);
    }
    else{
        return (<>
            <ListGroup>
                {parsedHistory.map((items, index) => 
                (<ListGroup.Item className={styles.historyListItem} key={index} onClick={e => historyClicked(e, index)}>
                    {Object.keys(items).map(key => (<>{key}: <strong>{items[key]}</strong>&nbsp;</>))}
                    <Button 
                        className="float-end" 
                        variant="danger" 
                        size="sm" 
                        onClick={e => removeHistoryClicked(e, index)}>
                        &times;
                    </Button>
                </ListGroup.Item>))}
            </ListGroup>
        </>);
    }
}