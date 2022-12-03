import useSWR from 'swr';
import Error from "next/error"
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import { useState, useEffect } from 'react';

import { addToFavourites, removeFromFavourites } from '../lib/UserData'

export default function ArtworkCardDetail(props){

    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null)
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);

    useEffect(()=>{
        setShowAdded(favouritesList?.includes(props.objectID));
    }, [favouritesList]);

    async function clickedFavourite(e){
        if(showAdded){
            setFavouritesList(await removeFromFavourites(props.objectID));
            setShowAdded(false);
        }
        else{
            setFavouritesList(await addToFavourites(props.objectID));
            setShowAdded(true);
        }
    }

    if(error){
        return(<>
            <Error statusCode={404}></Error>            
        </>);
    }    
    else if(data){
        return(<>
            <Card>
                {data.primaryImage ? <Card.Img variant="top" src={data.primaryImage} /> : null}
                    
                 <Card.Body>
                    <Card.Title>{data.title? data.title : "N/A"}</Card.Title>
                    <Card.Text>
                        <strong>Date: </strong>{data.objectDate? data.objectDate : "N/A"} <br />
                        <strong>Classification: </strong>{data.classification? data.classification : "N/A"} <br />
                        <strong>Medium: </strong>{data.Medium? data.Medium : "N/A"} <br />
                        <br />

                        <strong>Artist: </strong>{data.artistDisplayName ? data.artistDisplayName + " " : "N/A"}
                        {'( '}{data.artistWikidata_URL ? <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">Wiki</a> : "N/A"}{' )'} <br />
                        <strong>Credit Line: </strong>{data.creditLine ? data.creditLine : "N/A"} <br />
                        <strong>Dimensions: </strong>{data.dimensions ? data.dimensions : "N/A"} <br />
                        <br />
                        <Button variant={showAdded? "primary" : "outline-primary"} onClick={e => clickedFavourite(e)}>{showAdded? "+ Favourite (added)" : "+ Favourite"}</Button>    
                    </Card.Text>
                </Card.Body>        
            </Card>
        </>);
    }
    else{
        return null;
    }
}