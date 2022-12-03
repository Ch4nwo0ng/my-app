import useSWR from 'swr';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Error from "next/error"
import { Row, Col, Card, Pagination } from 'react-bootstrap';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '../../public/data/validObjectIDList.json'

const PER_PAGE = 12;

export default function ArtworkHome(){

    const [artworkList, setArtworkList] = useState();
    const [page, setPage] = useState(1);

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];

    const {data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

    function previousPage(e) {
        if(page > 1){ 
            setPage(page - 1);
        }
    }

    function nextPage(e){
        if(page < artworkList.length){
            setPage(page + 1);
        }
    }

    useEffect(()=>{
        if(data){
            var results = [];
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }
               
            setArtworkList(results);
        }       
    },[data]);

    if(error){ 
        return(<>
            <Error statusCode={404}></Error>
        </>);
    }
    else if(artworkList) {
        return(<>
            <Row className="gy-4">                         
                {artworkList.length > 0 ? 
                artworkList[page - 1].map((artworkList)=>
                (<Col lg={3} key={artworkList} ><ArtworkCard objectID={artworkList}/></Col> )) :
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <h4>Nothing Here</h4>
                                Try searching for something else
                            </Card.Text>
                        </Card.Body>
                    </Card>
                }
            </Row>

            &nbsp;

            {artworkList.length > 0 ? 
                <Row>
                    <Col>
                        <Pagination>
                            <Pagination.Prev onClick={e =>{previousPage(e)}}/>
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={e => {nextPage(e)}}/>
                        </Pagination>
                    </Col>     
                </Row> : null }
        </>);
    }else{
        return null;
    }

}