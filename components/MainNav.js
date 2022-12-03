import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Link from 'next/link'
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { NavDropdown } from 'react-bootstrap';
import { addToHistory } from "../lib/UserData";
import { removeToken } from "../lib/authenticate";
import { readToken } from '../lib/authenticate';

export default function MainNav(){

    const router = useRouter();
    //const [route,setRoute] = useState('');

    const [isExpanded, setIsExpanded] = useState(false);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [searchField, setSearchField] = useState('');

    async function submitForm(e) {
        e.preventDefault();        
        //var queryString = `title=true&q=${searchField}`;
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
        //console.log(searchHistory);        
        setIsExpanded(false);
        router.push( `/artwork?title=true&q=${searchField}`);
    }    

    let token = readToken();

    function logout(){
        setIsExpanded(false);
        removeToken();
        router.push('/login');
    }
    //searchField !!!!

    return(<>
        <Navbar className="fixed-top navbar navbar-expand-lg navbar-dark bg-primary" expand = "lg" expanded={isExpanded}>
            <Container>
                <Navbar.Brand>Chanwoong Park</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsExpanded(isExpanded ? false : true)}/>
                
                <Navbar.Collapse id="basic-navbar-nav" >
                    <Nav className="me-auto">
                        <Link href="/" passHref legacyBehavior><Nav.Link onClick={() => setIsExpanded(isExpanded ? false : true)} active={router.pathname === "/"}>Home</Nav.Link></Link>
                        {token && 
                            <Link href = "/search" passHref legacyBehavior><Nav.Link onClick={() => setIsExpanded(isExpanded ? false : true)} active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>                   
                        }
                        </Nav>
                    &nbsp;
                    {token && 
                        <Form className="d-flex" onSubmit={submitForm}>
                            <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => setSearchField(e.target.value)}
                            />
                            <Button type="submit" className="btn btn-info">Search</Button>
                        </Form>
                    }

                    &nbsp;
                    {token ?
                        <Nav>
                            <NavDropdown title={token.userName} id="basic-nav-dropdown">
                                <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item onClick={() => setIsExpanded(isExpanded ? false : true)} active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item></Link>
                                <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={() => setIsExpanded(isExpanded ? false : true)} active={router.pathname === "/history"} >Search History</NavDropdown.Item></Link>
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        :
                        <Nav className="ms-auto">
                            <Link href="/register" passHref legacyBehavior><Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/register"}>Register</Nav.Link></Link>
                            <Link href="/login" passHref legacyBehavior><Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/login"}>Login</Nav.Link></Link>
                        </Nav>  
                    }                   
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <br/><br/>
    </>);
}
