import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import TextInput from '../Editor';

function Compose(props) {
    
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const handleSubject = (e) => {

    }

    const handleBody = (e) => {
        console.log(e.target.value);
        setBody(e.target.value)
    }

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    return (
        <div>
            <Modal
            show={props.compose}
            size="lg"
            onHide={() => {props.setCompose(false)}}
            aria-labelledby="example-custom-modal-styling-title"
            modal-90w
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        New Thread
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                    <div className="mb-3">
                        <label className="form-label">To</label>
                        <Select options={options} isMulti = {true} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Request response</label>
                        <Select options={options} isMulti = {true} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <input type="text" value = {subject} className="form-control" onChange = {handleSubject}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Body</label>
                        <TextInput />
                    </div>
                    </form>
                    
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Compose;
