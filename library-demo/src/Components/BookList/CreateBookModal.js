import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './BookList.css';

function CreateBookModal({ showModal, setShowModal, refetch }) {
    const [name, setName] = useState('');
    const [transcript, setTranscript] = useState('');

    const createBookRequest = async () => {
        try {
            const response = await fetch('/data-api/api/Book', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    transcript
                })
            });
            const data = await response.json();
            if (response.ok) {
                setShowModal(false);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await createBookRequest();
        refetch();
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create Compliance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name for compliance" value={name} onChange={(event) => setName(event.target.value)} />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="transcript">
                        <Form.Label>Transcript</Form.Label>
                        <Form.Control as="textarea" rows={8} placeholder="Enter transcript recording" value={transcript} onChange={(event) => setTranscript(event.target.value)} />
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CreateBookModal;
