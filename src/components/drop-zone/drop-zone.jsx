
import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import './drop-zone.css';

const DropZone = ({onFilesAdded, disabled = false}) => {
    const ref = createRef();
    const [highlight, setHighlight] = useState(false);

    const openFileDialog = () => {
        if (disabled) {
            return
        }
        ref.current.click();
    }

    const fileListToArray = list => {
        const array = [];
        for (var i = 0; i < list.length; i++) {
            array.push(list.item(i));
        }
        return array;
    }

    const _onFilesAdded = event => {
        if (disabled) return;
        const files = event.target.files;
        if (onFilesAdded) {
            const array = fileListToArray(files);
            onFilesAdded(array);
        }
    }

    const onDragOver = event => {
        event.preventDefault();

        if (disabled) return;

        setHighlight(true);
    };

    const onDragLeave = event => {
        setHighlight(false);
    };

    const onDrop = event => {
        event.preventDefault();

        if (disabled) return;

        const files = event.dataTransfer.files;
        if (onFilesAdded) {
            const array = fileListToArray(files);
            onFilesAdded(array);
        }
        setHighlight(false);
    }

    return (
        <div
            className={`dropzone ${highlight ? "highlight" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={openFileDialog}
            style={{ cursor: disabled ? "default" : "pointer" }}
        >
            <img
                alt="upload"
                className='icon'
                src={"assets/icons/cloud-upload.svg"}
                style={{ cursor: disabled ? "default" : "pointer" }}
            />
            <input
                ref={ref}
                className="file-input"
                type="file"
                multiple
                onChange={_onFilesAdded}
            />
            <span>Upload Files</span>
        </div>
    )
}

export default DropZone;

DropZone.propTypes = {
    onFilesAdded: PropTypes.func,
    disabled: PropTypes.bool,
}