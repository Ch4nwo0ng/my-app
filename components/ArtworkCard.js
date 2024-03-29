import useSWR from 'swr';
import Error from "next/error";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';

//return null???
export default function ArtworkCards(props){

  const {data, error} = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`);

    if(error){
      return(<>
        <Error statusCode={404}></Error>
      </>);
    } 
    else if(data){
        return (<>          
            <Card style={{ width: '18rem'}} text={'dark'}>              
              <Card.Img variant='top' src={data.primaryImageSmall ? data.primaryImageSmall : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"} />                
              <Card.Body>
                <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>                  
                  <Card.Text>                  
                    <strong>Date: </strong>{data.objectDate? data.objectDate : "N/A"} <br/>
                    <strong>Classification: </strong>{data.classification ? data.classification : "N/A"} <br/>
                    <strong>Medium: </strong>{data.medium ? data.medium : "N/A"} <br/>
                    <br/>
                    <Link href={`/artwork/${data.objectID}`} passHref>
                                <Button variant="outline-dark">
                                    <strong>ID: </strong>{data.objectID}
                                </Button>
                            </Link>
                 </Card.Text>   
              </Card.Body>
            </Card>                
        </>);
    }  
    else{
      return null;
    } 
}