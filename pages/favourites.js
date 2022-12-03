import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import ArtworkCard from '../components/ArtworkCard';

export default function Favourites(){

    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)

    if(!favouritesList){       
        return null;
    }

    if(favouritesList){
        return(<>
            <Row className="gy-4">
                    {favouritesList.length > 0 ?
                     favouritesList.map((favouritesList)=>(
                        <Col key={favouritesList} lg={3}>
                            <ArtworkCard objectID={favouritesList}/>
                        </Col>
                     )) :
                     <Card>
                        <Card.Body>
                            <Card.Text>
                                <h4>Nothing Here</h4>
                                Try adding some new artwork to the list.
                            </Card.Text>
                        </Card.Body>
                     </Card>
                    }
            </Row>
        </>);
    }
}