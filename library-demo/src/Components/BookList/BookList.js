import React, { useState, useEffect } from 'react';
import { Card, Button, } from 'react-bootstrap';
import './BookList.css';
import CreateBookModal from './CreateBookModal';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const BookList = () => {
    const [compliances, setCompliances] = useState([
        {
            "id": "1",
            "name": "Testing",
            "transcript": "testing Flow"
        },
        {
            "id": "2",
            "name": "Testing1",
            "transcript": "testing Flow1"
        },
        {
            "id": "3",
            "name": "Testing",
            "transcript": "testing Flow"
        },
        {
            "id": "4",
            "name": "Testing1",
            "transcript": "testing Flow1"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // const fetchData = async (disableLoadState) => {
    //     if (!disableLoadState) setIsLoading(true);
    //     try {
    //         const response = await fetch('/data-api/api/Book');
    //         console.log("response", response);
    //         if (!response.ok) {
    //             throw new Error(response.statusText);
    //         }
    //         const data = await response.json();
    //         setBooks(data.value);
    //     } catch (error) {
    //         setError(error);
    //     }
    //     setIsLoading(false);
    // };

    // const deleteBook = async (id) => {
    //     try {
    //         const response = await fetch(`/data-api/api/Book/id/${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error(response.statusText);
    //         }
    //         await fetchData(true);
    //     } catch (error) { }
    // }

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // if (error) {
    //     return <p>{error.message}</p>;
    // }

    // if (isLoading) {
    //     return <p>Loading ...</p>;
    // }
    const [alignment, setAlignment] = React.useState('web');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return (
        <div className='book-page'>
            <div style={{ textAlign: 'left', margin: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Transcripts</h1>
                <div>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Create
                    </Button>
                </div>
                <CreateBookModal showModal={showModal} setShowModal={setShowModal} refetch={{}} />
            </div>
            <div className='book-list'>
                {compliances.map(compliance =>
                    <Card key={compliance.id} style={{ width: '33rem', margin: '1rem' }}>
                        <Card.Body>
                            <Card.Title>{compliance.name}</Card.Title>
                            <Card.Text>
                                {compliance.transcript}
                            </Card.Text>
                            <ToggleButtonGroup
                                value={alignment}
                                exclusive
                                onChange={handleChange}>
                                <ToggleButton value="web" color="success" size='small'>Compliant</ToggleButton>
                                <ToggleButton value="android" color="warning">Need-Review</ToggleButton>
                                <ToggleButton value="ios" color="error">Non-Compliant</ToggleButton>
                            </ToggleButtonGroup>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default BookList;