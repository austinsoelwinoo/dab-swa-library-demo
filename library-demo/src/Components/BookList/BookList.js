import React, { useEffect, useState } from 'react';
import { Card, Button, } from 'react-bootstrap';
import './BookList.css';
import CreateBookModal from './CreateBookModal';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { BASE_URL, COMPLIANT, NON_COMPLIANT, NEED_REVIEW } from "./FlagChecker"
const BookList = () => {
    const [compliances, setCompliances] = useState([]);

    useEffect(() => {
        getAllCompliance()
    }, [])

    async function getAllCompliance() {
        const responseGet = await fetch(BASE_URL, {
            method: "GET",
            mode: 'no-cors'
        });
        const listData = await responseGet.text()
        console.log("listData", listData)
        setCompliances(JSON.parse(listData));
    }
    const [showModal, setShowModal] = useState(false);

    async function updateCompliance(compliance) {
        const responseUpdate = await fetch(BASE_URL, {
            method: "PUT",
            mode: 'no-cors',
            body: JSON.stringify(compliance),
        });
        const listData = await responseUpdate.text()
        console.log("listData", listData)
        setCompliances(JSON.parse(listData));
    }

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
                                value={compliance.complianceFlag}
                                exclusive
                                onChange={(_event, newFlag) => {
                                    compliance.complianceFlag = newFlag
                                    updateCompliance(compliance)
                                }}>
                                <ToggleButton value={COMPLIANT} color="success" size='small'>{COMPLIANT}</ToggleButton>
                                <ToggleButton value={NEED_REVIEW} color="warning" size='small'>{NEED_REVIEW}</ToggleButton>
                                <ToggleButton value={NON_COMPLIANT} color="error" size='small'>{NON_COMPLIANT}</ToggleButton>
                            </ToggleButtonGroup>
                            <Card.Footer>
                                {compliance.complianceReason}
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default BookList;